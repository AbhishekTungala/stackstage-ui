import { Request, Response, NextFunction } from "express";
import { logger } from "./logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Log the error
  logger.error('Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Determine error type and response
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details: any = undefined;

  // Handle known error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
    details = err.details || err.errors;
  } else if (err.name === 'UnauthorizedError' || err.status === 401) {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.status === 403) {
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.status === 404) {
    statusCode = 404;
    message = 'Not Found';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  } else if (err.code === 11000) { // MongoDB duplicate key
    statusCode = 409;
    message = 'Duplicate resource';
  } else if (err.status) {
    statusCode = err.status;
    message = err.message;
  }

  // Don't expose stack traces in production
  const responseError: any = {
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  };

  if (details) {
    responseError.details = details;
  }

  // Include stack trace in development
  if (process.env.NODE_ENV === 'development') {
    responseError.stack = err.stack;
  }

  res.status(statusCode).json(responseError);
}