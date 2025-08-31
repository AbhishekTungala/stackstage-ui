import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { createServer, type Server } from "http";
import { setupAuth } from "./routes/auth";
import { registerRoutes } from "./routes";
import { logger } from "./utils/logger";
import { errorHandler } from "./utils/errorHandler";

export function createApp(): { app: express.Application; server: Server } {
  const app = express();
  const server = createServer(app);

  // Middleware
  app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? process.env.FRONTEND_URL : '*',
    credentials: true
  }));
  
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Request logging middleware
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    const path = req.path;
    let capturedJsonResponse: Record<string, any> | undefined = undefined;

    const originalResJson = res.json;
    res.json = function (bodyJson, ...args) {
      capturedJsonResponse = bodyJson;
      return originalResJson.apply(res, [bodyJson, ...args]);
    };

    res.on("finish", () => {
      const duration = Date.now() - start;
      if (path.startsWith("/api")) {
        let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
        if (capturedJsonResponse) {
          logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
        }

        if (logLine.length > 80) {
          logLine = logLine.slice(0, 79) + "…";
        }

        logger.info(logLine);
      }
    });

    next();
  });

  // Setup authentication
  setupAuth(app);

  // Register API routes
  registerRoutes(app);

  // Error handling middleware
  app.use(errorHandler);

  return { app, server };
}