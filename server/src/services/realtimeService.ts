import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import { aiService } from './aiService';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

interface AnalysisStreamData {
  sessionId: string;
  userId?: string;
  analysisId: string;
  progress: number;
  status: 'started' | 'processing' | 'analyzing' | 'completed' | 'error';
  data?: any;
  error?: string;
}

class RealtimeService extends EventEmitter {
  private io: Server | null = null;
  private activeAnalyses: Map<string, AnalysisStreamData> = new Map();

  initialize(httpServer: HttpServer) {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5000",
        methods: ["GET", "POST"],
        credentials: true
      },
      transports: ['websocket', 'polling']
    });

    this.setupSocketHandlers();
    logger.info('Real-time service initialized with Socket.IO');
  }

  private setupSocketHandlers() {
    if (!this.io) return;

    this.io.on('connection', (socket) => {
      logger.info(`Client connected: ${socket.id}`);

      // Join user to their personal room for private updates
      socket.on('join-user-room', (userId: string) => {
        socket.join(`user-${userId}`);
        logger.info(`User ${userId} joined personal room`);
      });

      // Handle analysis subscription
      socket.on('subscribe-analysis', (analysisId: string) => {
        socket.join(`analysis-${analysisId}`);
        logger.info(`Client subscribed to analysis: ${analysisId}`);
        
        // Send current status if analysis exists
        const analysis = this.activeAnalyses.get(analysisId);
        if (analysis) {
          socket.emit('analysis-update', analysis);
        }
      });

      // Handle unsubscription
      socket.on('unsubscribe-analysis', (analysisId: string) => {
        socket.leave(`analysis-${analysisId}`);
        logger.info(`Client unsubscribed from analysis: ${analysisId}`);
      });

      // Handle real-time chat
      socket.on('chat-message', async (data: {
        message: string;
        sessionId: string;
        persona?: string;
        context?: any;
      }) => {
        try {
          await this.handleChatMessage(socket, data);
        } catch (error) {
          logger.error('Chat message error:', error);
          socket.emit('chat-error', { error: 'Failed to process message' });
        }
      });

      // Handle analysis start
      socket.on('start-analysis', async (data: {
        content: string;
        analysisMode: string;
        cloudProvider: string;
        userRegion: string;
        sessionId: string;
        userId?: string;
      }) => {
        try {
          await this.startStreamingAnalysis(socket, data);
        } catch (error) {
          logger.error('Analysis start error:', error);
          socket.emit('analysis-error', { error: 'Failed to start analysis' });
        }
      });

      socket.on('disconnect', (reason) => {
        logger.info(`Client disconnected: ${socket.id}, reason: ${reason}`);
      });
    });
  }

  async startStreamingAnalysis(socket: any, data: any) {
    const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const streamData: AnalysisStreamData = {
      sessionId: data.sessionId,
      userId: data.userId,
      analysisId,
      progress: 0,
      status: 'started'
    };

    this.activeAnalyses.set(analysisId, streamData);

    // Emit initial status
    this.emitAnalysisUpdate(analysisId, {
      ...streamData,
      status: 'started',
      progress: 10
    });

    try {
      // Step 1: Preprocessing
      await this.sleep(500);
      this.emitAnalysisUpdate(analysisId, {
        ...streamData,
        status: 'processing',
        progress: 25,
        data: { step: 'preprocessing', message: 'Parsing and validating content...' }
      });

      // Step 2: AI Analysis
      await this.sleep(1000);
      this.emitAnalysisUpdate(analysisId, {
        ...streamData,
        status: 'analyzing',
        progress: 50,
        data: { step: 'ai-analysis', message: 'Running AI analysis...' }
      });

      // Call AI service for actual analysis
      const analysisResult = await aiService.analyzeInfrastructure({
        content: data.content,
        analysisMode: data.analysisMode,
        cloudProvider: data.cloudProvider,
        userRegion: data.userRegion,
        regionalImpact: true,
        fileType: 'text'
      });

      // Step 3: Post-processing
      await this.sleep(500);
      this.emitAnalysisUpdate(analysisId, {
        ...streamData,
        status: 'processing',
        progress: 80,
        data: { step: 'post-processing', message: 'Generating recommendations...' }
      });

      // Step 4: Completion
      await this.sleep(300);
      this.emitAnalysisUpdate(analysisId, {
        ...streamData,
        status: 'completed',
        progress: 100,
        data: { 
          step: 'completed',
          result: analysisResult,
          message: 'Analysis completed successfully!'
        }
      });

      // Clean up after 5 minutes
      setTimeout(() => {
        this.activeAnalyses.delete(analysisId);
      }, 5 * 60 * 1000);

    } catch (error) {
      logger.error('Streaming analysis error:', error);
      this.emitAnalysisUpdate(analysisId, {
        ...streamData,
        status: 'error',
        progress: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  async handleChatMessage(socket: any, data: any) {
    const { message, sessionId, persona, context } = data;

    // Emit typing indicator
    socket.emit('chat-typing', { sessionId, typing: true });

    try {
      // Stream the response
      const response = await aiService.getAssistantResponse({
        message,
        persona: persona || 'architect',
        context: context?.analysisContext
      });

      // Simulate streaming by sending chunks
      const responseText = response.message;
      const chunks = this.splitIntoChunks(responseText, 50);
      
      for (let i = 0; i < chunks.length; i++) {
        await this.sleep(100); // Simulate typing delay
        socket.emit('chat-chunk', {
          sessionId,
          chunk: chunks[i],
          isComplete: i === chunks.length - 1,
          suggestions: i === chunks.length - 1 ? response.suggestions : undefined
        });
      }

      // Stop typing indicator
      socket.emit('chat-typing', { sessionId, typing: false });

    } catch (error) {
      socket.emit('chat-typing', { sessionId, typing: false });
      throw error;
    }
  }

  private emitAnalysisUpdate(analysisId: string, data: AnalysisStreamData) {
    if (!this.io) return;

    this.activeAnalyses.set(analysisId, data);
    
    // Emit to analysis room
    this.io.to(`analysis-${analysisId}`).emit('analysis-update', data);
    
    // Emit to user's personal room if userId is available
    if (data.userId) {
      this.io.to(`user-${data.userId}`).emit('analysis-update', data);
    }

    // Emit to global analysis room for monitoring
    this.io.to('global-analysis').emit('analysis-update', data);
  }

  private splitIntoChunks(text: string, chunkSize: number): string[] {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Public methods for triggering updates from other services
  public broadcastSystemUpdate(message: string) {
    if (!this.io) return;
    this.io.emit('system-update', { message, timestamp: new Date() });
  }

  public notifyUser(userId: string, notification: any) {
    if (!this.io) return;
    this.io.to(`user-${userId}`).emit('notification', notification);
  }

  public broadcastAnalysisComplete(analysisId: string, result: any) {
    if (!this.io) return;
    this.io.to(`analysis-${analysisId}`).emit('analysis-complete', result);
  }

  // Server-Sent Events alternative for clients that prefer SSE
  public createSSEStream(req: any, res: any, analysisId: string) {
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    const sendEvent = (data: any) => {
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    // Send initial connection confirmation
    sendEvent({ type: 'connected', analysisId });

    // Set up listener for this analysis
    const updateListener = (data: AnalysisStreamData) => {
      if (data.analysisId === analysisId) {
        sendEvent({ type: 'analysis-update', data });
      }
    };

    this.on('analysis-update', updateListener);

    // Clean up on client disconnect
    req.on('close', () => {
      this.off('analysis-update', updateListener);
      res.end();
    });

    // Keep connection alive
    const keepAlive = setInterval(() => {
      sendEvent({ type: 'ping', timestamp: Date.now() });
    }, 30000);

    req.on('close', () => {
      clearInterval(keepAlive);
    });
  }

  public getActiveAnalyses(): AnalysisStreamData[] {
    return Array.from(this.activeAnalyses.values());
  }

  public getAnalysisStatus(analysisId: string): AnalysisStreamData | null {
    return this.activeAnalyses.get(analysisId) || null;
  }
}

export const realtimeService = new RealtimeService();