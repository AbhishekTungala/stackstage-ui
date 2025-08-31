import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

// Simple in-memory rate limiter for AI endpoints
interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  message: string;
}

class SimpleRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old entries every minute
    setInterval(() => {
      this.cleanup();
    }, 60000);
  }

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get or create request history for this identifier
    let requestTimes = this.requests.get(identifier) || [];
    
    // Remove old requests outside the window
    requestTimes = requestTimes.filter(time => time > windowStart);
    
    // Check if limit exceeded
    if (requestTimes.length >= this.config.maxRequests) {
      return false;
    }
    
    // Add current request
    requestTimes.push(now);
    this.requests.set(identifier, requestTimes);
    
    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    const requestTimes = this.requests.get(identifier) || [];
    const validRequests = requestTimes.filter(time => time > windowStart);
    
    return Math.max(0, this.config.maxRequests - validRequests.length);
  }

  getResetTime(identifier: string): number {
    const requestTimes = this.requests.get(identifier) || [];
    if (requestTimes.length === 0) return 0;
    
    const oldestRequest = Math.min(...requestTimes);
    return oldestRequest + this.config.windowMs;
  }

  private cleanup(): void {
    const now = Date.now();
    
    for (const [identifier, requestTimes] of this.requests.entries()) {
      const windowStart = now - this.config.windowMs;
      const validRequests = requestTimes.filter(time => time > windowStart);
      
      if (validRequests.length === 0) {
        this.requests.delete(identifier);
      } else {
        this.requests.set(identifier, validRequests);
      }
    }
  }
}

// Create rate limiters for different endpoints
const aiAnalysisLimiter = new SimpleRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 10, // 10 analysis requests per 15 minutes
  message: "Too many analysis requests. Please try again later."
});

const aiAssistantLimiter = new SimpleRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 minutes
  maxRequests: 20, // 20 assistant requests per 5 minutes
  message: "Too many assistant requests. Please slow down."
});

const aiTestLimiter = new SimpleRateLimiter({
  windowMs: 1 * 60 * 1000, // 1 minute
  maxRequests: 5, // 5 test requests per minute
  message: "Too many test requests. Please wait before testing again."
});

// Middleware factory
export function createRateLimiter(type: 'analysis' | 'assistant' | 'test') {
  const limiter = type === 'analysis' ? aiAnalysisLimiter : 
                 type === 'assistant' ? aiAssistantLimiter : 
                 aiTestLimiter;

  return (req: Request, res: Response, next: NextFunction) => {
    // Use IP address as identifier (in production, consider using user ID)
    const identifier = req.ip || req.connection.remoteAddress || 'unknown';
    
    if (!limiter.isAllowed(identifier)) {
      const resetTime = limiter.getResetTime(identifier);
      const resetDate = new Date(resetTime);
      
      logger.warn(`Rate limit exceeded for ${type} endpoint from ${identifier}`);
      
      return res.status(429).json({
        success: false,
        error: "rate_limit_exceeded",
        message: limiter.config.message,
        reset_time: resetDate.toISOString(),
        retry_after: Math.ceil((resetTime - Date.now()) / 1000),
        timestamp: new Date().toISOString()
      });
    }

    // Add rate limit info to response headers
    const remaining = limiter.getRemainingRequests(identifier);
    const resetTime = limiter.getResetTime(identifier);
    
    res.set({
      'X-RateLimit-Limit': limiter.config.maxRequests.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': Math.ceil(resetTime / 1000).toString()
    });

    next();
  };
}

// Retry logic utility
export class RetryHelper {
  static async withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delayMs: number = 1000,
    backoffMultiplier: number = 2
  ): Promise<T> {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          logger.error(`Final retry attempt failed:`, error);
          throw lastError;
        }
        
        const delay = delayMs * Math.pow(backoffMultiplier, attempt - 1);
        logger.warn(`Retry attempt ${attempt}/${maxRetries} failed, retrying in ${delay}ms:`, error);
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  }

  static isRetryableError(error: Error): boolean {
    const retryableMessages = [
      'ECONNRESET',
      'ETIMEDOUT',
      'ENOTFOUND',
      'rate limit',
      'timeout',
      '429',
      '500',
      '502',
      '503',
      '504'
    ];
    
    const errorMessage = error.message.toLowerCase();
    return retryableMessages.some(msg => errorMessage.includes(msg));
  }
}