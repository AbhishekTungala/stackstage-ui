import { createApp } from "./app";
import { logger } from "./utils/logger";
import { setupVite, serveStatic } from "../vite";

async function startServer() {
  const { app, server } = createApp();

  // Setup Vite for development or static serving for production
  if (app.get("env") === "development") {
    await setupVite(app as any, server);
  } else {
    serveStatic(app as any);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    logger.info(`🚀 StackStage server running on port ${port}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🔗 API available at: http://0.0.0.0:${port}/api`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  });
}

startServer().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});