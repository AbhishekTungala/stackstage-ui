import { Router, Request, Response } from 'express';
import { visualizationService } from '../services/visualizationService';
import { authenticate, AuthenticatedRequest, authorize, PERMISSIONS } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';
import { geoLocationService } from '../services/geoLocationService';
import { multiCloudService } from '../services/cloudService';

const router = Router();

// Generate analysis charts
router.post('/charts/analysis',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { analysisResult } = req.body;

      if (!analysisResult) {
        return res.status(400).json({
          success: false,
          error: 'Analysis result is required'
        });
      }

      const charts = visualizationService.generateAnalysisCharts(analysisResult);

      logger.info(`Generated ${charts.length} charts for user ${req.user?.id}`);

      res.json({
        success: true,
        data: {
          charts,
          totalCharts: charts.length,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating analysis charts:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate analysis charts'
      });
    }
  }
);

// Generate region latency chart
router.get('/charts/latency',
  authenticate,
  authorize(PERMISSIONS.READ_CLOUD_STATUS),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const { provider, userLocation } = req.query;

      let regions;
      if (userLocation) {
        // Use provided location
        const location = JSON.parse(userLocation as string);
        if (provider) {
          regions = geoLocationService.getRegionsByProvider(provider as any, location);
        } else {
          regions = geoLocationService.getAllRegionsWithLatency(location);
        }
      } else {
        // Try to detect user location from IP
        const clientIP = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const detectedLocation = await geoLocationService.detectLocationFromIP(clientIP);
        
        if (provider) {
          regions = geoLocationService.getRegionsByProvider(provider as any, detectedLocation);
        } else {
          regions = geoLocationService.getAllRegionsWithLatency(detectedLocation);
        }
      }

      const chart = visualizationService.generateRegionLatencyChart(regions);

      res.json({
        success: true,
        data: {
          chart,
          regions: regions.length,
          provider: provider || 'all',
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating latency chart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate latency chart'
      });
    }
  }
);

// Generate cost comparison chart
router.get('/charts/cost-comparison',
  authenticate,
  authorize(PERMISSIONS.READ_CLOUD_STATUS),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      // Get cost data from all available providers
      const providers = [];
      
      if (multiCloudService.isProviderAvailable('aws')) {
        const awsStatus = await multiCloudService.getAWSStatus();
        providers.push({ provider: 'aws', ...awsStatus });
      }
      
      if (multiCloudService.isProviderAvailable('gcp')) {
        const gcpStatus = await multiCloudService.getGCPStatus();
        providers.push({ provider: 'gcp', ...gcpStatus });
      }
      
      if (multiCloudService.isProviderAvailable('azure')) {
        const azureStatus = await multiCloudService.getAzureStatus();
        providers.push({ provider: 'azure', ...azureStatus });
      }

      if (providers.length === 0) {
        return res.status(404).json({
          success: false,
          error: 'No cloud providers configured'
        });
      }

      const chart = visualizationService.generateCostComparisonChart(providers);

      res.json({
        success: true,
        data: {
          chart,
          providers: providers.length,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating cost comparison chart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate cost comparison chart'
      });
    }
  }
);

// Generate performance metrics chart
router.post('/charts/performance',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { metrics, timeRange = '24h' } = req.body;

      // If no metrics provided, generate mock data
      const performanceMetrics = metrics || {
        responseTime: null,
        throughput: null
      };

      const chart = visualizationService.generatePerformanceChart(performanceMetrics);

      res.json({
        success: true,
        data: {
          chart,
          timeRange,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating performance chart:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate performance chart'
      });
    }
  }
);

// Generate Mermaid architecture diagram
router.post('/diagrams/architecture',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { architecture } = req.body;

      if (!architecture) {
        return res.status(400).json({
          success: false,
          error: 'Architecture configuration is required'
        });
      }

      const diagram = visualizationService.generateArchitectureDiagram(architecture);

      logger.info(`Generated architecture diagram for user ${req.user?.id}`);

      res.json({
        success: true,
        data: {
          diagram,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating architecture diagram:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate architecture diagram'
      });
    }
  }
);

// Generate process flow diagram
router.post('/diagrams/process-flow',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { analysis } = req.body;

      if (!analysis) {
        return res.status(400).json({
          success: false,
          error: 'Analysis data is required'
        });
      }

      const diagram = visualizationService.generateProcessFlowDiagram(analysis);

      res.json({
        success: true,
        data: {
          diagram,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating process flow diagram:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate process flow diagram'
      });
    }
  }
);

// Generate deployment diagram
router.post('/diagrams/deployment',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { infrastructure } = req.body;

      if (!infrastructure) {
        return res.status(400).json({
          success: false,
          error: 'Infrastructure data is required'
        });
      }

      const diagram = visualizationService.generateDeploymentDiagram(infrastructure);

      res.json({
        success: true,
        data: {
          diagram,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating deployment diagram:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate deployment diagram'
      });
    }
  }
);

// Generate API sequence diagram
router.post('/diagrams/api-sequence',
  authenticate,
  authorize(PERMISSIONS.GENERATE_DIAGRAMS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { apiFlow } = req.body;

      const diagram = visualizationService.generateAPISequenceDiagram(apiFlow || {});

      res.json({
        success: true,
        data: {
          diagram,
          generatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      logger.error('Error generating API sequence diagram:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate API sequence diagram'
      });
    }
  }
);

// Get all available chart types
router.get('/charts/types',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      data: {
        chartTypes: [
          {
            type: 'radar',
            name: 'Radar Chart',
            description: 'Multi-dimensional analysis visualization',
            useCase: 'Security assessment, performance metrics'
          },
          {
            type: 'line',
            name: 'Line Chart',
            description: 'Trend analysis over time',
            useCase: 'Score trends, performance over time'
          },
          {
            type: 'bar',
            name: 'Bar Chart',
            description: 'Comparative analysis',
            useCase: 'Region latency, cost comparison'
          },
          {
            type: 'pie',
            name: 'Pie Chart',
            description: 'Distribution analysis',
            useCase: 'Issue categories, resource distribution'
          },
          {
            type: 'area',
            name: 'Area Chart',
            description: 'Multi-metric performance visualization',
            useCase: 'Performance metrics with multiple dimensions'
          }
        ],
        diagramTypes: [
          {
            type: 'flowchart',
            name: 'Architecture Flowchart',
            description: 'System architecture visualization',
            format: 'Mermaid.js'
          },
          {
            type: 'sequence',
            name: 'Sequence Diagram',
            description: 'API interaction flows',
            format: 'Mermaid.js'
          },
          {
            type: 'deployment',
            name: 'Deployment Diagram',
            description: 'Infrastructure deployment visualization',
            format: 'Mermaid.js'
          }
        ]
      }
    });
  }
);

export { router as visualizationRouter };