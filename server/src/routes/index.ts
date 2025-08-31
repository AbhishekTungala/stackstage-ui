import type { Express } from "express";
import { analysisRouter } from "./analysis";
import { assistantRouter } from "./assistant";
import { diagramRouter } from "./diagram";
import { locationRouter } from "./location";
import { cloudRouter } from "./cloud";
import { exportRouter } from "./export";
import { authRouter } from "./auth";

export function registerRoutes(app: Express): void {
  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      version: '1.0',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Register all API routes
  app.use('/api/analyze', analysisRouter);
  app.use('/api/assistant', assistantRouter);
  app.use('/api/diagram', diagramRouter);
  app.use('/api/location', locationRouter);
  app.use('/api/cloud', cloudRouter);
  app.use('/api/export', exportRouter);
  app.use('/api/auth', authRouter);
}