import { logger } from "../utils/logger";

interface DiagramRequest {
  content: string;
  diagramType: 'architecture' | 'resource-map' | 'security' | 'cost-flow';
  format: 'mermaid' | 'svg' | 'png';
  theme: 'default' | 'dark' | 'neutral' | 'forest';
  highlightRisks: boolean;
  includeMetrics: boolean;
}

class DiagramService {
  async generateDiagram(request: DiagramRequest) {
    try {
      logger.info(`Generating ${request.diagramType} diagram`);

      // Generate Mermaid code based on content
      const mermaidCode = this.generateMermaidCode(request);
      
      // If SVG or PNG requested, convert
      let result: any = { mermaidCode };
      
      if (request.format !== 'mermaid') {
        result = await this.convertDiagram(mermaidCode, request.format as 'svg' | 'png', request.theme);
      }

      return {
        ...result,
        type: request.diagramType,
        theme: request.theme,
        generatedAt: new Date().toISOString()
      };

    } catch (error) {
      logger.error('Diagram generation error:', error);
      throw error;
    }
  }

  async exportDiagram(mermaidCode: string, format: string, options: any = {}) {
    try {
      if (format === 'mermaid') {
        return { mermaidCode };
      }

      return await this.convertDiagram(mermaidCode, format, options.theme || 'default');

    } catch (error) {
      logger.error('Diagram export error:', error);
      throw error;
    }
  }

  async getTemplates() {
    return {
      architecture: [
        {
          name: "Basic Web App",
          description: "Simple web application architecture",
          mermaidCode: `
graph TD
    A[Users] --> B[Load Balancer]
    B --> C[Web Servers]
    C --> D[Database]
    C --> E[Cache]
          `
        },
        {
          name: "Microservices",
          description: "Microservices architecture pattern",
          mermaidCode: `
graph TD
    A[API Gateway] --> B[Auth Service]
    A --> C[User Service]
    A --> D[Order Service]
    C --> E[User DB]
    D --> F[Order DB]
          `
        }
      ],
      security: [
        {
          name: "Security Zones",
          description: "Network security zones diagram",
          mermaidCode: `
graph TB
    subgraph "Public Zone"
        A[Internet]
        B[WAF]
    end
    subgraph "DMZ"
        C[Load Balancer]
        D[Web Servers]
    end
    subgraph "Private Zone"
        E[App Servers]
        F[Database]
    end
    A --> B --> C --> D --> E --> F
          `
        }
      ]
    };
  }

  private generateMermaidCode(request: DiagramRequest): string {
    const { content, diagramType } = request;

    // Basic diagram generation based on content analysis
    switch (diagramType) {
      case 'architecture':
        return this.generateArchitectureDiagram(content);
      case 'resource-map':
        return this.generateResourceMapDiagram(content);
      case 'security':
        return this.generateSecurityDiagram(content);
      case 'cost-flow':
        return this.generateCostFlowDiagram(content);
      default:
        return this.generateDefaultDiagram(content);
    }
  }

  private generateArchitectureDiagram(content: string): string {
    // Analyze content to identify components
    const hasDatabase = content.toLowerCase().includes('database') || content.toLowerCase().includes('db');
    const hasLoadBalancer = content.toLowerCase().includes('load balancer') || content.toLowerCase().includes('lb');
    const hasCache = content.toLowerCase().includes('cache') || content.toLowerCase().includes('redis');
    const hasApi = content.toLowerCase().includes('api') || content.toLowerCase().includes('rest');

    let diagram = `graph TD\n`;
    diagram += `    A[Users] --> B[Internet Gateway]\n`;
    
    if (hasLoadBalancer) {
      diagram += `    B --> C[Load Balancer]\n`;
      diagram += `    C --> D[Web Servers]\n`;
    } else {
      diagram += `    B --> D[Web Servers]\n`;
    }

    if (hasApi) {
      diagram += `    D --> E[API Gateway]\n`;
      diagram += `    E --> F[Application Servers]\n`;
    } else {
      diagram += `    D --> F[Application Servers]\n`;
    }

    if (hasCache) {
      diagram += `    F --> G[Cache Layer]\n`;
      diagram += `    G --> H[Database]\n`;
    } else {
      diagram += `    F --> H[Database]\n`;
    }

    return diagram;
  }

  private generateResourceMapDiagram(content: string): string {
    return `
graph LR
    subgraph "Compute"
        A[EC2 Instances]
        B[Auto Scaling Group]
    end
    subgraph "Storage"
        C[S3 Buckets]
        D[EBS Volumes]
    end
    subgraph "Network"
        E[VPC]
        F[Subnets]
        G[Security Groups]
    end
    subgraph "Database"
        H[RDS]
        I[ElastiCache]
    end
    A --> D
    B --> A
    E --> F
    F --> G
    `;
  }

  private generateSecurityDiagram(content: string): string {
    return `
graph TB
    subgraph "Internet"
        A[External Users]
        B[Malicious Actors]
    end
    subgraph "Edge Security"
        C[WAF]
        D[DDoS Protection]
    end
    subgraph "Network Security"
        E[VPC]
        F[Security Groups]
        G[NACLs]
    end
    subgraph "Application Security"
        H[IAM Roles]
        I[Application Firewall]
    end
    subgraph "Data Security"
        J[Encryption at Rest]
        K[Encryption in Transit]
    end
    A --> C
    B -.-> C
    C --> D --> E
    E --> F --> G
    G --> H --> I
    I --> J --> K
    `;
  }

  private generateCostFlowDiagram(content: string): string {
    return `
graph TD
    A[Total Monthly Cost] --> B[Compute - 45%]
    A --> C[Storage - 25%]
    A --> D[Network - 20%]
    A --> E[Other - 10%]
    
    B --> B1[EC2 Instances]
    B --> B2[Lambda Functions]
    
    C --> C1[S3 Storage]
    C --> C2[EBS Volumes]
    
    D --> D1[Data Transfer]
    D --> D2[Load Balancer]
    
    E --> E1[Monitoring]
    E --> E2[Security Services]
    `;
  }

  private generateDefaultDiagram(content: string): string {
    return `
graph TD
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
    D --> F[End]
    E --> F
    `;
  }

  private async convertDiagram(mermaidCode: string, format: 'svg' | 'png', theme: string) {
    try {
      // For now, return the mermaid code with metadata
      // In a real implementation, you would use a service like mermaid-cli or puppeteer
      return {
        mermaidCode,
        format,
        theme,
        note: 'Conversion service would be implemented here'
      };
    } catch (error) {
      logger.error('Diagram conversion error:', error);
      throw error;
    }
  }
}

export const diagramService = new DiagramService();