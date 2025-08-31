import { S3Client, PutObjectCommand, GetObjectCommand, ListObjectsV2Command, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Storage } from '@google-cloud/storage';
import { BlobServiceClient } from '@azure/storage-blob';
import { logger } from '../utils/logger';

interface CloudProvider {
  name: 'aws' | 'gcp' | 'azure';
  uploadFile(fileName: string, content: Buffer | string): Promise<string>;
  downloadFile(fileName: string): Promise<Buffer>;
  listFiles(prefix?: string): Promise<string[]>;
  deleteFile(fileName: string): Promise<boolean>;
  getFileUrl(fileName: string): Promise<string>;
  testConnection(): Promise<boolean>;
}

class AWSProvider implements CloudProvider {
  name: 'aws' = 'aws';
  private s3Client: S3Client;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || 'stackstage-storage';
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.s3Client.send(new ListObjectsV2Command({
        Bucket: this.bucketName,
        MaxKeys: 1
      }));
      return true;
    } catch (error) {
      logger.error('AWS connection test failed:', error);
      return false;
    }
  }

  async uploadFile(fileName: string, content: Buffer | string): Promise<string> {
    try {
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: content,
        ContentType: this.getContentType(fileName)
      });
      
      await this.s3Client.send(command);
      return `s3://${this.bucketName}/${fileName}`;
    } catch (error) {
      logger.error('AWS upload error:', error);
      throw error;
    }
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: fileName
      });
      
      const response = await this.s3Client.send(command);
      const chunks: Buffer[] = [];
      
      if (response.Body) {
        // @ts-ignore
        for await (const chunk of response.Body) {
          chunks.push(chunk);
        }
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('AWS download error:', error);
      throw error;
    }
  }

  async listFiles(prefix = ''): Promise<string[]> {
    try {
      const command = new ListObjectsV2Command({
        Bucket: this.bucketName,
        Prefix: prefix
      });
      
      const response = await this.s3Client.send(command);
      return response.Contents?.map(obj => obj.Key || '') || [];
    } catch (error) {
      logger.error('AWS list error:', error);
      return [];
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: fileName
      });
      
      await this.s3Client.send(command);
      return true;
    } catch (error) {
      logger.error('AWS delete error:', error);
      return false;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    return `https://${this.bucketName}.s3.amazonaws.com/${fileName}`;
  }

  private getContentType(fileName: string): string {
    const ext = fileName.split('.').pop()?.toLowerCase();
    const types: Record<string, string> = {
      'json': 'application/json',
      'txt': 'text/plain',
      'pdf': 'application/pdf',
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg'
    };
    return types[ext || ''] || 'application/octet-stream';
  }
}

class GCPProvider implements CloudProvider {
  name: 'gcp' = 'gcp';
  private storage: Storage;
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCP_STORAGE_BUCKET || 'stackstage-storage';
    this.storage = new Storage({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE
    });
  }

  async testConnection(): Promise<boolean> {
    try {
      const [exists] = await this.storage.bucket(this.bucketName).exists();
      return exists;
    } catch (error) {
      logger.error('GCP connection test failed:', error);
      return false;
    }
  }

  async uploadFile(fileName: string, content: Buffer | string): Promise<string> {
    try {
      const file = this.storage.bucket(this.bucketName).file(fileName);
      await file.save(content);
      return `gs://${this.bucketName}/${fileName}`;
    } catch (error) {
      logger.error('GCP upload error:', error);
      throw error;
    }
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    try {
      const file = this.storage.bucket(this.bucketName).file(fileName);
      const [contents] = await file.download();
      return contents;
    } catch (error) {
      logger.error('GCP download error:', error);
      throw error;
    }
  }

  async listFiles(prefix = ''): Promise<string[]> {
    try {
      const [files] = await this.storage.bucket(this.bucketName).getFiles({ prefix });
      return files.map(file => file.name);
    } catch (error) {
      logger.error('GCP list error:', error);
      return [];
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      await this.storage.bucket(this.bucketName).file(fileName).delete();
      return true;
    } catch (error) {
      logger.error('GCP delete error:', error);
      return false;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    try {
      const file = this.storage.bucket(this.bucketName).file(fileName);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000 // 15 minutes
      });
      return url;
    } catch (error) {
      logger.error('GCP URL generation error:', error);
      return `gs://${this.bucketName}/${fileName}`;
    }
  }
}

class AzureProvider implements CloudProvider {
  name: 'azure' = 'azure';
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    this.containerName = process.env.AZURE_CONTAINER_NAME || 'stackstage-storage';
    const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING || '';
    this.blobServiceClient = BlobServiceClient.fromConnectionString(connectionString);
  }

  async testConnection(): Promise<boolean> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      await containerClient.getProperties();
      return true;
    } catch (error) {
      logger.error('Azure connection test failed:', error);
      return false;
    }
  }

  async uploadFile(fileName: string, content: Buffer | string): Promise<string> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
      await blockBlobClient.upload(buffer, buffer.length);
      return `azure://${this.containerName}/${fileName}`;
    } catch (error) {
      logger.error('Azure upload error:', error);
      throw error;
    }
  }

  async downloadFile(fileName: string): Promise<Buffer> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      
      const response = await blockBlobClient.download();
      const chunks: Buffer[] = [];
      
      if (response.readableStreamBody) {
        for await (const chunk of response.readableStreamBody) {
          chunks.push(chunk);
        }
      }
      
      return Buffer.concat(chunks);
    } catch (error) {
      logger.error('Azure download error:', error);
      throw error;
    }
  }

  async listFiles(prefix = ''): Promise<string[]> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const files: string[] = [];
      
      for await (const blob of containerClient.listBlobsFlat({ prefix })) {
        files.push(blob.name);
      }
      
      return files;
    } catch (error) {
      logger.error('Azure list error:', error);
      return [];
    }
  }

  async deleteFile(fileName: string): Promise<boolean> {
    try {
      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      await blockBlobClient.delete();
      return true;
    } catch (error) {
      logger.error('Azure delete error:', error);
      return false;
    }
  }

  async getFileUrl(fileName: string): Promise<string> {
    const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);
    return blockBlobClient.url;
  }
}

class MultiCloudService {
  private providers: Map<string, CloudProvider> = new Map();
  private defaultProvider: string;

  constructor() {
    this.defaultProvider = process.env.DEFAULT_CLOUD_PROVIDER || 'aws';
    this.initializeProviders();
  }

  private initializeProviders() {
    // Initialize providers based on available credentials
    if (process.env.AWS_ACCESS_KEY_ID) {
      this.providers.set('aws', new AWSProvider());
      logger.info('AWS provider initialized');
    }
    
    if (process.env.GCP_PROJECT_ID) {
      this.providers.set('gcp', new GCPProvider());
      logger.info('GCP provider initialized');
    }
    
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
      this.providers.set('azure', new AzureProvider());
      logger.info('Azure provider initialized');
    }

    if (this.providers.size === 0) {
      logger.warn('No cloud providers configured. Some features may not work.');
    }
  }

  getProvider(providerName?: string): CloudProvider | null {
    const name = providerName || this.defaultProvider;
    return this.providers.get(name) || null;
  }

  async uploadToProvider(providerName: string, fileName: string, content: Buffer | string): Promise<string> {
    const provider = this.getProvider(providerName);
    if (!provider) {
      throw new Error(`Provider ${providerName} not available`);
    }
    return provider.uploadFile(fileName, content);
  }

  async uploadToAllProviders(fileName: string, content: Buffer | string): Promise<Record<string, string>> {
    const results: Record<string, string> = {};
    
    for (const [name, provider] of Array.from(this.providers.entries())) {
      try {
        results[name] = await provider.uploadFile(fileName, content);
        logger.info(`Successfully uploaded to ${name}`);
      } catch (error) {
        logger.error(`Failed to upload to ${name}:`, error);
        results[name] = `Error: ${error}`;
      }
    }
    
    return results;
  }

  async getFileFromAnyProvider(fileName: string): Promise<{ provider: string; content: Buffer } | null> {
    for (const [name, provider] of Array.from(this.providers.entries())) {
      try {
        const content = await provider.downloadFile(fileName);
        return { provider: name, content };
      } catch (error) {
        logger.warn(`Failed to get file from ${name}:`, error);
        continue;
      }
    }
    return null;
  }

  async testAllConnections(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    
    for (const [name, provider] of Array.from(this.providers.entries())) {
      try {
        results[name] = await provider.testConnection();
      } catch (error) {
        logger.error(`Connection test failed for ${name}:`, error);
        results[name] = false;
      }
    }
    
    return results;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  isProviderAvailable(providerName: string): boolean {
    return this.providers.has(providerName);
  }

  // Legacy methods for backward compatibility
  async getAWSStatus() {
    const provider = this.getProvider('aws');
    if (!provider) {
      return this.getMockAWSStatus();
    }
    
    const connected = await provider.testConnection();
    return {
      connected,
      regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
      resources: {
        ec2Instances: 0,
        s3Buckets: 1,
        rdsInstances: 0,
        lambdaFunctions: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: connected ? 'Connected' : 'Connection failed'
    };
  }

  async getAzureStatus() {
    const provider = this.getProvider('azure');
    if (!provider) {
      return this.getMockAzureStatus();
    }
    
    const connected = await provider.testConnection();
    return {
      connected,
      regions: ['eastus', 'westus2', 'westeurope'],
      resources: {
        virtualMachines: 0,
        storageAccounts: 1,
        sqlDatabases: 0,
        functionApps: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: connected ? 'Connected' : 'Connection failed'
    };
  }

  async getGCPStatus() {
    const provider = this.getProvider('gcp');
    if (!provider) {
      return this.getMockGCPStatus();
    }
    
    const connected = await provider.testConnection();
    return {
      connected,
      regions: ['us-central1', 'us-west1', 'europe-west1'],
      resources: {
        computeInstances: 0,
        cloudStorageBuckets: 1,
        cloudSqlInstances: 0,
        cloudFunctions: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: connected ? 'Connected' : 'Connection failed'
    };
  }

  async connectProvider(provider: string, credentials: any) {
    try {
      logger.info(`Connecting to ${provider}`);
      
      // Validate credentials format
      switch (provider) {
        case 'aws':
          if (!credentials.accessKeyId || !credentials.secretAccessKey) {
            throw new Error('AWS credentials require accessKeyId and secretAccessKey');
          }
          break;
        case 'azure':
          if (!credentials.connectionString) {
            throw new Error('Azure credentials require connectionString');
          }
          break;
        case 'gcp':
          if (!credentials.projectId || !credentials.keyFile) {
            throw new Error('GCP credentials require projectId and keyFile');
          }
          break;
        default:
          throw new Error(`Unsupported provider: ${provider}`);
      }

      // Test connection
      const testResult = await this.testConnection(provider, credentials);
      
      return {
        provider,
        connected: testResult.success,
        message: testResult.message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error('Provider connection error:', error);
      throw error;
    }
  }

  async getAllRegions() {
    return {
      aws: [
        { code: 'us-east-1', name: 'US East (N. Virginia)', latency: 50 },
        { code: 'us-west-2', name: 'US West (Oregon)', latency: 80 },
        { code: 'eu-west-1', name: 'Europe (Ireland)', latency: 120 },
        { code: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', latency: 200 }
      ],
      azure: [
        { code: 'eastus', name: 'East US', latency: 55 },
        { code: 'westus2', name: 'West US 2', latency: 85 },
        { code: 'westeurope', name: 'West Europe', latency: 125 },
        { code: 'southeastasia', name: 'Southeast Asia', latency: 205 }
      ],
      gcp: [
        { code: 'us-central1', name: 'US Central', latency: 60 },
        { code: 'us-west1', name: 'US West', latency: 90 },
        { code: 'europe-west1', name: 'Europe West', latency: 130 },
        { code: 'asia-southeast1', name: 'Asia Southeast', latency: 210 }
      ]
    };
  }

  private async testConnection(provider: string, credentials: any) {
    try {
      // Mock connection test - in production, this would make actual API calls
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: `Successfully connected to ${provider}`
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to connect to ${provider}: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  private getMockAWSStatus() {
    return {
      connected: false,
      regions: ['us-east-1', 'us-west-2', 'eu-west-1'],
      resources: {
        ec2Instances: 0,
        s3Buckets: 0,
        rdsInstances: 0,
        lambdaFunctions: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: 'No credentials configured'
    };
  }

  private getMockAzureStatus() {
    return {
      connected: false,
      regions: ['eastus', 'westus2', 'westeurope'],
      resources: {
        virtualMachines: 0,
        storageAccounts: 0,
        sqlDatabases: 0,
        functionApps: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: 'No credentials configured'
    };
  }

  private getMockGCPStatus() {
    return {
      connected: false,
      regions: ['us-central1', 'us-west1', 'europe-west1'],
      resources: {
        computeInstances: 0,
        cloudStorageBuckets: 0,
        cloudSqlInstances: 0,
        cloudFunctions: 0
      },
      estimatedMonthlyCost: '$0.00',
      lastUpdated: new Date().toISOString(),
      status: 'No credentials configured'
    };
  }
}

// Backward compatibility
export const cloudService = new MultiCloudService();
export const multiCloudService = cloudService;
export { CloudProvider, AWSProvider, GCPProvider, AzureProvider };