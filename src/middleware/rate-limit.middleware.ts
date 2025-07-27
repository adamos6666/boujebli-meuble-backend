import { Injectable, NestMiddleware, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private store: RateLimitStore = {};
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    message: 'Too many requests, please try again later.',
  }) {
    this.config = config;
  }

  use(req: Request, res: Response, next: NextFunction) {
    const key = this.getClientKey(req);
    const now = Date.now();

    // Clean up expired entries
    this.cleanup();

    // Get or create rate limit entry
    let entry = this.store[key];
    if (!entry) {
      entry = {
        count: 0,
        resetTime: now + this.config.windowMs,
      };
      this.store[key] = entry;
    }

    // Check if window has reset
    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    // Increment request count
    entry.count++;

    // Check if limit exceeded
    if (entry.count > this.config.maxRequests) {
      const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
      
      res.setHeader('Retry-After', retryAfter.toString());
      res.setHeader('X-RateLimit-Limit', this.config.maxRequests.toString());
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

      throw new HttpException({
        statusCode: HttpStatus.TOO_MANY_REQUESTS,
        message: this.config.message,
        retryAfter,
      }, HttpStatus.TOO_MANY_REQUESTS);
    }

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', this.config.maxRequests.toString());
    res.setHeader('X-RateLimit-Remaining', (this.config.maxRequests - entry.count).toString());
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    next();
  }

  private getClientKey(req: Request): string {
    // Use IP address as default key
    const ip = req.ip || req.connection.remoteAddress || 'unknown';
    
    // For authenticated users, include user ID
    const user = (req as any).user;
    if (user && user.id) {
      return `user:${user.id}`;
    }

    return `ip:${ip}`;
  }

  private cleanup(): void {
    const now = Date.now();
    const keys = Object.keys(this.store);
    
    for (const key of keys) {
      const entry = this.store[key];
      if (now > entry.resetTime) {
        delete this.store[key];
      }
    }
  }

  // Method to get rate limit info for a client
  getRateLimitInfo(key: string) {
    const entry = this.store[key];
    if (!entry) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: Date.now() + this.config.windowMs,
      };
    }

    const now = Date.now();
    if (now > entry.resetTime) {
      return {
        count: 0,
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
      };
    }

    return {
      count: entry.count,
      remaining: Math.max(0, this.config.maxRequests - entry.count),
      resetTime: entry.resetTime,
    };
  }

  // Method to reset rate limit for a client
  resetRateLimit(key: string): void {
    delete this.store[key];
  }
} 