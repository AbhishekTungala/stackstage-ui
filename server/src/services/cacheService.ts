import Redis from 'ioredis';
import { logger } from '../utils/logger';

interface CacheConfig {
  ttl: number; // Time to live in seconds
  prefix?: string;
  compression?: boolean;
}

class CacheService {
  private redis: Redis | null = null;
  private isConnected = false;
  private fallbackCache = new Map<string, { value: any; expires: number }>();

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const redisUrl = process.env.REDIS_URL;
    const redisHost = process.env.REDIS_HOST || 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT || '6379');
    const redisPassword = process.env.REDIS_PASSWORD;

    try {
      if (redisUrl) {
        this.redis = new Redis(redisUrl);
      } else {
        this.redis = new Redis({
          host: redisHost,
          port: redisPort,
          password: redisPassword,
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        });
      }

      // Set up event handlers
      this.redis.on('connect', () => {
        logger.info('Connected to Redis');
        this.isConnected = true;
      });

      this.redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
        this.isConnected = false;
      });

      this.redis.on('ready', () => {
        logger.info('Redis is ready');
        this.isConnected = true;
      });

      this.redis.on('close', () => {
        logger.warn('Redis connection closed');
        this.isConnected = false;
      });

      // Test connection
      await this.redis.ping();
      logger.info('Redis cache service initialized successfully');

    } catch (error) {
      logger.warn('Redis not available, using in-memory fallback cache:', error);
      this.redis = null;
      this.isConnected = false;
    }
  }

  // Basic cache operations
  async get<T = any>(key: string): Promise<T | null> {
    try {
      if (this.isConnected && this.redis) {
        const value = await this.redis.get(key);
        return value ? JSON.parse(value) : null;
      } else {
        return this.getFallback(key);
      }
    } catch (error) {
      logger.error(`Cache get error for key ${key}:`, error);
      return this.getFallback(key);
    }
  }

  async set(key: string, value: any, config: CacheConfig = { ttl: 3600 }): Promise<boolean> {
    try {
      const serializedValue = JSON.stringify(value);
      
      if (this.isConnected && this.redis) {
        if (config.ttl > 0) {
          await this.redis.setex(key, config.ttl, serializedValue);
        } else {
          await this.redis.set(key, serializedValue);
        }
        return true;
      } else {
        return this.setFallback(key, value, config.ttl);
      }
    } catch (error) {
      logger.error(`Cache set error for key ${key}:`, error);
      return this.setFallback(key, value, config.ttl);
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        await this.redis.del(key);
        return true;
      } else {
        this.fallbackCache.delete(key);
        return true;
      }
    } catch (error) {
      logger.error(`Cache delete error for key ${key}:`, error);
      this.fallbackCache.delete(key);
      return false;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        const result = await this.redis.exists(key);
        return result === 1;
      } else {
        const item = this.fallbackCache.get(key);
        return item ? item.expires > Date.now() : false;
      }
    } catch (error) {
      logger.error(`Cache exists error for key ${key}:`, error);
      return false;
    }
  }

  // Advanced cache operations
  async mget(keys: string[]): Promise<Array<any | null>> {
    try {
      if (this.isConnected && this.redis) {
        const values = await this.redis.mget(...keys);
        return values.map(v => v ? JSON.parse(v) : null);
      } else {
        return keys.map(key => this.getFallback(key));
      }
    } catch (error) {
      logger.error('Cache mget error:', error);
      return keys.map(key => this.getFallback(key));
    }
  }

  async mset(keyValuePairs: Array<{ key: string; value: any; ttl?: number }>): Promise<boolean> {
    try {
      if (this.isConnected && this.redis) {
        const pipeline = this.redis.pipeline();
        
        keyValuePairs.forEach(({ key, value, ttl = 3600 }) => {
          const serializedValue = JSON.stringify(value);
          if (ttl > 0) {
            pipeline.setex(key, ttl, serializedValue);
          } else {
            pipeline.set(key, serializedValue);
          }
        });
        
        await pipeline.exec();
        return true;
      } else {
        keyValuePairs.forEach(({ key, value, ttl = 3600 }) => {
          this.setFallback(key, value, ttl);
        });
        return true;
      }
    } catch (error) {
      logger.error('Cache mset error:', error);
      return false;
    }
  }

  // Cache patterns for common use cases
  async cacheAnalysis(analysisId: string, analysis: any, ttl: number = 3600): Promise<boolean> {
    return this.set(`analysis:${analysisId}`, analysis, { ttl });
  }

  async getAnalysis(analysisId: string): Promise<any | null> {
    return this.get(`analysis:${analysisId}`);
  }

  async cacheUserSession(userId: string, sessionData: any, ttl: number = 86400): Promise<boolean> {
    return this.set(`session:${userId}`, sessionData, { ttl });
  }

  async getUserSession(userId: string): Promise<any | null> {
    return this.get(`session:${userId}`);
  }

  async cacheCloudStatus(provider: string, status: any, ttl: number = 300): Promise<boolean> {
    return this.set(`cloud:${provider}:status`, status, { ttl });
  }

  async getCloudStatus(provider: string): Promise<any | null> {
    return this.get(`cloud:${provider}:status`);
  }

  async cacheRegionLatency(region: string, latency: number, ttl: number = 1800): Promise<boolean> {
    return this.set(`latency:${region}`, latency, { ttl });
  }

  async getRegionLatency(region: string): Promise<number | null> {
    return this.get(`latency:${region}`);
  }

  // Cache statistics and monitoring
  async getStats(): Promise<any> {
    try {
      if (this.isConnected && this.redis) {
        const info = await this.redis.info('memory');
        const keyspace = await this.redis.info('keyspace');
        
        return {
          connected: true,
          memory: this.parseRedisInfo(info),
          keyspace: this.parseRedisInfo(keyspace),
          fallbackCacheSize: this.fallbackCache.size
        };
      } else {
        return {
          connected: false,
          fallbackCacheSize: this.fallbackCache.size,
          message: 'Using in-memory fallback cache'
        };
      }
    } catch (error) {
      logger.error('Cache stats error:', error);
      return {
        connected: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        fallbackCacheSize: this.fallbackCache.size
      };
    }
  }

  // Invalidation patterns
  async invalidatePattern(pattern: string): Promise<number> {
    try {
      if (this.isConnected && this.redis) {
        const keys = await this.redis.keys(pattern);
        if (keys.length > 0) {
          await this.redis.del(...keys);
        }
        return keys.length;
      } else {
        // Invalidate fallback cache
        let count = 0;
        const regex = new RegExp(pattern.replace('*', '.*'));
        for (const key of this.fallbackCache.keys()) {
          if (regex.test(key)) {
            this.fallbackCache.delete(key);
            count++;
          }
        }
        return count;
      }
    } catch (error) {
      logger.error(`Cache invalidation error for pattern ${pattern}:`, error);
      return 0;
    }
  }

  async invalidateUserCache(userId: string): Promise<number> {
    return this.invalidatePattern(`session:${userId}*`);
  }

  async invalidateAnalysisCache(analysisId?: string): Promise<number> {
    const pattern = analysisId ? `analysis:${analysisId}` : 'analysis:*';
    return this.invalidatePattern(pattern);
  }

  // Health check
  async healthCheck(): Promise<{ status: 'healthy' | 'degraded' | 'unhealthy'; details: any }> {
    try {
      if (this.isConnected && this.redis) {
        const start = Date.now();
        await this.redis.ping();
        const latency = Date.now() - start;
        
        const status = latency < 100 ? 'healthy' : latency < 500 ? 'degraded' : 'unhealthy';
        
        return {
          status,
          details: {
            connected: true,
            latency: `${latency}ms`,
            fallbackCacheSize: this.fallbackCache.size
          }
        };
      } else {
        return {
          status: 'degraded',
          details: {
            connected: false,
            message: 'Using fallback cache',
            fallbackCacheSize: this.fallbackCache.size
          }
        };
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        details: {
          connected: false,
          error: error instanceof Error ? error.message : 'Unknown error',
          fallbackCacheSize: this.fallbackCache.size
        }
      };
    }
  }

  // Fallback cache methods
  private getFallback<T = any>(key: string): T | null {
    const item = this.fallbackCache.get(key);
    if (item && item.expires > Date.now()) {
      return item.value;
    } else if (item) {
      this.fallbackCache.delete(key);
    }
    return null;
  }

  private setFallback(key: string, value: any, ttl: number): boolean {
    try {
      const expires = ttl > 0 ? Date.now() + (ttl * 1000) : Number.MAX_SAFE_INTEGER;
      this.fallbackCache.set(key, { value, expires });
      
      // Clean up expired entries periodically
      if (this.fallbackCache.size % 100 === 0) {
        this.cleanupFallbackCache();
      }
      
      return true;
    } catch (error) {
      logger.error('Fallback cache set error:', error);
      return false;
    }
  }

  private cleanupFallbackCache() {
    const now = Date.now();
    for (const [key, item] of this.fallbackCache.entries()) {
      if (item.expires <= now) {
        this.fallbackCache.delete(key);
      }
    }
  }

  private parseRedisInfo(info: string): Record<string, string> {
    const result: Record<string, string> = {};
    info.split('\r\n').forEach(line => {
      if (line.includes(':')) {
        const [key, value] = line.split(':');
        result[key] = value;
      }
    });
    return result;
  }

  // Graceful shutdown
  async disconnect(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
      this.isConnected = false;
      logger.info('Redis connection closed');
    }
  }
}

export const cacheService = new CacheService();