import { register, Counter, Histogram, Gauge, collectDefaultMetrics } from 'prom-client';
import { logger } from '../utils/logger';

interface MetricData {
  name: string;
  value: number;
  labels?: Record<string, string>;
  timestamp?: Date;
}

interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  message?: string;
  responseTime?: number;
  details?: any;
}

class MonitoringService {
  // Prometheus metrics
  private httpRequestDuration: Histogram<string>;
  private httpRequestCount: Counter<string>;
  private activeConnections: Gauge<string>;
  private cacheHitRate: Gauge<string>;
  private aiRequestCount: Counter<string>;
  private aiRequestDuration: Histogram<string>;
  private analysisCount: Counter<string>;
  private errorCount: Counter<string>;
  private systemHealth: Gauge<string>;

  // Internal tracking
  private healthChecks: Map<string, HealthCheckResult> = new Map();
  private customMetrics: Map<string, MetricData> = new Map();
  private startTime: Date;

  constructor() {
    this.startTime = new Date();
    this.initializeMetrics();
    this.startHealthChecks();
    
    // Collect default metrics (CPU, memory, etc.)
    collectDefaultMetrics({ register });

    logger.info('Monitoring service initialized');
  }

  private initializeMetrics() {
    // HTTP metrics
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.1, 0.5, 1, 2, 5, 10]
    });

    this.httpRequestCount = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code']
    });

    this.activeConnections = new Gauge({
      name: 'active_connections',
      help: 'Number of active connections',
      labelNames: ['type']
    });

    // Cache metrics
    this.cacheHitRate = new Gauge({
      name: 'cache_hit_rate',
      help: 'Cache hit rate percentage',
      labelNames: ['cache_type']
    });

    // AI service metrics
    this.aiRequestCount = new Counter({
      name: 'ai_requests_total',
      help: 'Total number of AI service requests',
      labelNames: ['model', 'persona', 'status']
    });

    this.aiRequestDuration = new Histogram({
      name: 'ai_request_duration_seconds',
      help: 'AI request duration in seconds',
      labelNames: ['model', 'persona'],
      buckets: [1, 5, 10, 15, 30, 60, 120]
    });

    // Analysis metrics
    this.analysisCount = new Counter({
      name: 'analysis_total',
      help: 'Total number of analyses performed',
      labelNames: ['type', 'provider', 'status']
    });

    // Error metrics
    this.errorCount = new Counter({
      name: 'errors_total',
      help: 'Total number of errors',
      labelNames: ['service', 'type', 'severity']
    });

    // System health
    this.systemHealth = new Gauge({
      name: 'system_health_score',
      help: 'Overall system health score (0-1)',
      labelNames: ['component']
    });

    // Register all metrics
    register.registerMetric(this.httpRequestDuration);
    register.registerMetric(this.httpRequestCount);
    register.registerMetric(this.activeConnections);
    register.registerMetric(this.cacheHitRate);
    register.registerMetric(this.aiRequestCount);
    register.registerMetric(this.aiRequestDuration);
    register.registerMetric(this.analysisCount);
    register.registerMetric(this.errorCount);
    register.registerMetric(this.systemHealth);
  }

  // HTTP request tracking
  recordHttpRequest(method: string, route: string, statusCode: number, duration: number) {
    this.httpRequestCount.inc({
      method: method.toUpperCase(),
      route,
      status_code: statusCode.toString()
    });

    this.httpRequestDuration.observe({
      method: method.toUpperCase(),
      route,
      status_code: statusCode.toString()
    }, duration / 1000);
  }

  // Connection tracking
  recordActiveConnection(type: 'websocket' | 'http', delta: number) {
    this.activeConnections.inc({ type }, delta);
  }

  // Cache metrics
  recordCacheOperation(type: string, hit: boolean) {
    // Update hit rate (simplified - in production, use a sliding window)
    const currentRate = this.cacheHitRate.get({ cache_type: type });
    const newRate = hit ? Math.min(100, (currentRate?.value || 0) + 1) : Math.max(0, (currentRate?.value || 0) - 1);
    this.cacheHitRate.set({ cache_type: type }, newRate);
  }

  // AI service metrics
  recordAIRequest(model: string, persona: string, duration: number, status: 'success' | 'error') {
    this.aiRequestCount.inc({ model, persona, status });
    if (status === 'success') {
      this.aiRequestDuration.observe({ model, persona }, duration / 1000);
    }
  }

  // Analysis metrics
  recordAnalysis(type: string, provider: string, status: 'completed' | 'failed') {
    this.analysisCount.inc({ type, provider, status });
  }

  // Error tracking
  recordError(service: string, type: string, severity: 'low' | 'medium' | 'high' | 'critical') {
    this.errorCount.inc({ service, type, severity });
    
    // Log critical errors
    if (severity === 'critical') {
      logger.error(`Critical error in ${service}: ${type}`);
    }
  }

  // Health check management
  async performHealthCheck(serviceName: string, checkFunction: () => Promise<HealthCheckResult>): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const result = await checkFunction();
      result.responseTime = Date.now() - startTime;
      
      this.healthChecks.set(serviceName, result);
      
      // Update health score
      const healthScore = result.status === 'healthy' ? 1 : result.status === 'degraded' ? 0.5 : 0;
      this.systemHealth.set({ component: serviceName }, healthScore);
      
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        service: serviceName,
        status: 'unhealthy',
        message: error instanceof Error ? error.message : 'Unknown error',
        responseTime: Date.now() - startTime
      };
      
      this.healthChecks.set(serviceName, result);
      this.systemHealth.set({ component: serviceName }, 0);
      
      return result;
    }
  }

  // Get all health checks
  getAllHealthChecks(): HealthCheckResult[] {
    return Array.from(this.healthChecks.values());
  }

  // Get system overview
  getSystemOverview() {
    const uptime = Date.now() - this.startTime.getTime();
    const healthChecks = this.getAllHealthChecks();
    
    const healthyServices = healthChecks.filter(h => h.status === 'healthy').length;
    const totalServices = healthChecks.length;
    const overallHealth = totalServices > 0 ? (healthyServices / totalServices) * 100 : 0;

    return {
      uptime: Math.floor(uptime / 1000), // seconds
      startTime: this.startTime.toISOString(),
      health: {
        overall: Math.round(overallHealth),
        services: {
          healthy: healthyServices,
          total: totalServices
        }
      },
      metrics: {
        totalRequests: this.getTotalRequests(),
        activeConnections: this.getActiveConnections(),
        errorRate: this.getErrorRate()
      }
    };
  }

  // Custom metrics
  recordCustomMetric(name: string, value: number, labels?: Record<string, string>) {
    this.customMetrics.set(name, {
      name,
      value,
      labels,
      timestamp: new Date()
    });
  }

  getCustomMetric(name: string): MetricData | undefined {
    return this.customMetrics.get(name);
  }

  // Prometheus metrics endpoint
  async getMetrics(): Promise<string> {
    return register.metrics();
  }

  // Health check endpoint data
  getHealthStatus() {
    const healthChecks = this.getAllHealthChecks();
    const overview = this.getSystemOverview();
    
    const status = overview.health.overall >= 80 ? 'healthy' : 
                  overview.health.overall >= 50 ? 'degraded' : 'unhealthy';

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: overview.uptime,
      services: healthChecks.reduce((acc, check) => {
        acc[check.service] = {
          status: check.status,
          message: check.message,
          responseTime: check.responseTime
        };
        return acc;
      }, {} as Record<string, any>),
      metrics: {
        totalRequests: this.getTotalRequests(),
        activeConnections: this.getActiveConnections(),
        errorRate: this.getErrorRate(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
  }

  // Start periodic health checks
  private startHealthChecks() {
    // Check every 30 seconds
    setInterval(async () => {
      try {
        // Basic system health
        await this.performHealthCheck('system', async () => ({
          service: 'system',
          status: 'healthy',
          details: {
            memory: process.memoryUsage(),
            uptime: process.uptime()
          }
        }));

        // Add more health checks as needed
        this.recordCustomMetric('health_check_timestamp', Date.now());
        
      } catch (error) {
        logger.error('Health check error:', error);
      }
    }, 30000);
  }

  // Helper methods for metric calculations
  private getTotalRequests(): number {
    try {
      const metric = register.getSingleMetric('http_requests_total') as Counter<string>;
      return metric ? Object.values(metric.hashMap).reduce((sum, val) => sum + val.value, 0) : 0;
    } catch {
      return 0;
    }
  }

  private getActiveConnections(): number {
    try {
      const metric = register.getSingleMetric('active_connections') as Gauge<string>;
      return metric ? Object.values(metric.hashMap).reduce((sum, val) => sum + val.value, 0) : 0;
    } catch {
      return 0;
    }
  }

  private getErrorRate(): number {
    try {
      const errorMetric = register.getSingleMetric('errors_total') as Counter<string>;
      const requestMetric = register.getSingleMetric('http_requests_total') as Counter<string>;
      
      if (!errorMetric || !requestMetric) return 0;
      
      const totalErrors = Object.values(errorMetric.hashMap).reduce((sum, val) => sum + val.value, 0);
      const totalRequests = Object.values(requestMetric.hashMap).reduce((sum, val) => sum + val.value, 0);
      
      return totalRequests > 0 ? (totalErrors / totalRequests) * 100 : 0;
    } catch {
      return 0;
    }
  }

  // Graceful shutdown
  async shutdown() {
    register.clear();
    this.healthChecks.clear();
    this.customMetrics.clear();
    logger.info('Monitoring service shutdown complete');
  }
}

export const monitoringService = new MonitoringService();