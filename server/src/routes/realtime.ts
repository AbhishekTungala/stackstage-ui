import { Router, Request, Response } from 'express';
import { realtimeService } from '../services/realtimeService';
import { authenticate, AuthenticatedRequest, authorize, PERMISSIONS } from '../middleware/authMiddleware';
import { logger } from '../utils/logger';

const router = Router();

// Server-Sent Events endpoint for analysis streaming
router.get('/analysis/:analysisId/stream', 
  authenticate,
  authorize(PERMISSIONS.READ_ANALYSIS),
  (req: AuthenticatedRequest, res: Response) => {
    const { analysisId } = req.params;
    
    logger.info(`Starting SSE stream for analysis: ${analysisId}, user: ${req.user?.id}`);
    
    // Set up SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Send initial connection event
    res.write(`data: ${JSON.stringify({ 
      type: 'connected', 
      analysisId,
      timestamp: new Date().toISOString()
    })}\n\n`);

    // Set up analysis status updates
    const sendUpdate = (data: any) => {
      res.write(`data: ${JSON.stringify({
        type: 'analysis-update',
        data,
        timestamp: new Date().toISOString()
      })}\n\n`);
    };

    // Listen for analysis updates
    const updateListener = (analysisData: any) => {
      if (analysisData.analysisId === analysisId) {
        sendUpdate(analysisData);
      }
    };

    realtimeService.on('analysis-update', updateListener);

    // Send existing analysis status if available
    const existingStatus = realtimeService.getAnalysisStatus(analysisId);
    if (existingStatus) {
      sendUpdate(existingStatus);
    }

    // Keep connection alive with periodic pings
    const keepAlive = setInterval(() => {
      res.write(`data: ${JSON.stringify({ 
        type: 'ping', 
        timestamp: new Date().toISOString() 
      })}\n\n`);
    }, 30000);

    // Cleanup on client disconnect
    req.on('close', () => {
      clearInterval(keepAlive);
      realtimeService.off('analysis-update', updateListener);
      res.end();
      logger.info(`SSE stream closed for analysis: ${analysisId}`);
    });

    req.on('error', (error) => {
      logger.error(`SSE stream error for analysis ${analysisId}:`, error);
      clearInterval(keepAlive);
      realtimeService.off('analysis-update', updateListener);
      res.end();
    });
  }
);

// Get active real-time analyses
router.get('/analyses/active',
  authenticate,
  authorize(PERMISSIONS.READ_ANALYSIS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const activeAnalyses = realtimeService.getActiveAnalyses();
      
      // Filter analyses based on user permissions
      const userAnalyses = activeAnalyses.filter(analysis => 
        analysis.userId === req.user?.id || req.user?.permissions.includes(PERMISSIONS.VIEW_SYSTEM_METRICS)
      );

      res.json({
        success: true,
        data: {
          total: userAnalyses.length,
          analyses: userAnalyses
        }
      });
    } catch (error) {
      logger.error('Error fetching active analyses:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch active analyses'
      });
    }
  }
);

// Get analysis status by ID
router.get('/analysis/:analysisId/status',
  authenticate,
  authorize(PERMISSIONS.READ_ANALYSIS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { analysisId } = req.params;
      const status = realtimeService.getAnalysisStatus(analysisId);

      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found or completed'
        });
      }

      // Check if user has access to this analysis
      if (status.userId !== req.user?.id && !req.user?.permissions.includes(PERMISSIONS.VIEW_SYSTEM_METRICS)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to this analysis'
        });
      }

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      logger.error('Error fetching analysis status:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch analysis status'
      });
    }
  }
);

// Cancel running analysis
router.post('/analysis/:analysisId/cancel',
  authenticate,
  authorize(PERMISSIONS.UPDATE_ANALYSIS),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { analysisId } = req.params;
      const status = realtimeService.getAnalysisStatus(analysisId);

      if (!status) {
        return res.status(404).json({
          success: false,
          error: 'Analysis not found'
        });
      }

      // Check if user owns this analysis or is admin
      if (status.userId !== req.user?.id && !req.user?.permissions.includes(PERMISSIONS.MANAGE_SYSTEM)) {
        return res.status(403).json({
          success: false,
          error: 'Access denied to cancel this analysis'
        });
      }

      if (status.status === 'completed' || status.status === 'error') {
        return res.status(400).json({
          success: false,
          error: 'Analysis already completed'
        });
      }

      // Cancel the analysis by updating its status
      const cancelledStatus = {
        ...status,
        status: 'error' as const,
        error: `Analysis cancelled by user ${req.user?.email}`,
        progress: 0
      };

      // Emit cancellation update
      realtimeService.emit('analysis-update', cancelledStatus);

      logger.info(`Analysis ${analysisId} cancelled by user ${req.user?.id}`);

      res.json({
        success: true,
        message: 'Analysis cancelled successfully'
      });
    } catch (error) {
      logger.error('Error cancelling analysis:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to cancel analysis'
      });
    }
  }
);

// WebSocket connection info endpoint
router.get('/websocket/info',
  authenticate,
  (req: AuthenticatedRequest, res: Response) => {
    res.json({
      success: true,
      data: {
        endpoint: '/socket.io',
        transports: ['websocket', 'polling'],
        events: {
          client_to_server: [
            'join-user-room',
            'subscribe-analysis',
            'unsubscribe-analysis',
            'chat-message',
            'start-analysis'
          ],
          server_to_client: [
            'analysis-update',
            'analysis-complete',
            'analysis-error',
            'chat-chunk',
            'chat-typing',
            'chat-error',
            'system-update',
            'notification'
          ]
        },
        authentication: 'Include JWT token in connection auth header',
        documentation: 'See README.md for WebSocket usage examples'
      }
    });
  }
);

// Broadcast system message (admin only)
router.post('/broadcast',
  authenticate,
  authorize(PERMISSIONS.MANAGE_SYSTEM),
  (req: AuthenticatedRequest, res: Response) => {
    try {
      const { message, type = 'info' } = req.body;

      if (!message) {
        return res.status(400).json({
          success: false,
          error: 'Message is required'
        });
      }

      const broadcastData = {
        type,
        message,
        timestamp: new Date().toISOString(),
        sender: req.user?.email
      };

      realtimeService.broadcastSystemUpdate(broadcastData.message);

      logger.info(`System broadcast sent by ${req.user?.email}: ${message}`);

      res.json({
        success: true,
        message: 'Broadcast sent successfully',
        data: broadcastData
      });
    } catch (error) {
      logger.error('Error sending broadcast:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send broadcast'
      });
    }
  }
);

export { router as realtimeRouter };