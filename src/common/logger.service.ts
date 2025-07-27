import { Injectable, LoggerService } from '@nestjs/common';

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  trace?: string;
  metadata?: Record<string, any>;
}

@Injectable()
export class CustomLoggerService implements LoggerService {
  private logLevel: LogLevel = LogLevel.INFO;
  private logs: LogEntry[] = [];
  private maxLogs = 1000; // Keep last 1000 logs in memory

  constructor(level?: LogLevel) {
    if (level) {
      this.logLevel = level;
    }
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    const currentIndex = levels.indexOf(this.logLevel);
    const messageIndex = levels.indexOf(level);
    return messageIndex <= currentIndex;
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, trace?: string, metadata?: Record<string, any>): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      trace,
      metadata,
    };
  }

  private addLog(entry: LogEntry): void {
    this.logs.push(entry);
    
    // Keep only the last maxLogs entries
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      const color = this.getColorForLevel(entry.level);
      const prefix = entry.context ? `[${entry.context}]` : '';
      console.log(`${color}${prefix} ${entry.message}${entry.metadata ? ` ${JSON.stringify(entry.metadata)}` : ''}\x1b[0m`);
    }
  }

  private getColorForLevel(level: LogLevel): string {
    switch (level) {
      case LogLevel.ERROR:
        return '\x1b[31m'; // Red
      case LogLevel.WARN:
        return '\x1b[33m'; // Yellow
      case LogLevel.INFO:
        return '\x1b[36m'; // Cyan
      case LogLevel.DEBUG:
        return '\x1b[35m'; // Magenta
      default:
        return '\x1b[0m'; // Reset
    }
  }

  log(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.INFO)) {
      const entry = this.createLogEntry(LogLevel.INFO, message, context, undefined, metadata);
      this.addLog(entry);
    }
  }

  error(message: string, trace?: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const entry = this.createLogEntry(LogLevel.ERROR, message, context, trace, metadata);
      this.addLog(entry);
    }
  }

  warn(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.WARN)) {
      const entry = this.createLogEntry(LogLevel.WARN, message, context, undefined, metadata);
      this.addLog(entry);
    }
  }

  debug(message: string, context?: string, metadata?: Record<string, any>): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      const entry = this.createLogEntry(LogLevel.DEBUG, message, context, undefined, metadata);
      this.addLog(entry);
    }
  }

  verbose(message: string, context?: string, metadata?: Record<string, any>): void {
    this.debug(message, context, metadata);
  }

  // Custom methods for specific use cases
  logRequest(req: any, context?: string): void {
    const metadata = {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      userId: req.user?.id,
    };
    this.log(`HTTP ${req.method} ${req.url}`, context, metadata);
  }

  logResponse(res: any, context?: string): void {
    const metadata = {
      statusCode: res.statusCode,
      responseTime: res.responseTime,
    };
    this.log(`Response ${res.statusCode}`, context, metadata);
  }

  logDatabase(query: string, duration: number, context?: string): void {
    const metadata = {
      query,
      duration,
    };
    this.log(`Database query executed in ${duration}ms`, context, metadata);
  }

  logAuth(userId: number, action: string, context?: string): void {
    const metadata = {
      userId,
      action,
    };
    this.log(`Authentication: ${action}`, context, metadata);
  }

  // Get logs for analysis
  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }
    
    return filteredLogs;
  }

  // Get logs by time range
  getLogsByTimeRange(startTime: Date, endTime: Date, level?: LogLevel): LogEntry[] {
    let filteredLogs = this.logs.filter(log => {
      const logTime = new Date(log.timestamp);
      return logTime >= startTime && logTime <= endTime;
    });
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    return filteredLogs;
  }

  // Get error logs
  getErrorLogs(limit?: number): LogEntry[] {
    return this.getLogs(LogLevel.ERROR, limit);
  }

  // Clear logs
  clearLogs(): void {
    this.logs = [];
  }

  // Get log statistics
  getLogStats(): Record<string, any> {
    const stats = {
      total: this.logs.length,
      byLevel: {} as Record<LogLevel, number>,
      recentErrors: this.getErrorLogs(10).length,
    };

    // Count by level
    Object.values(LogLevel).forEach(level => {
      stats.byLevel[level] = this.logs.filter(log => log.level === level).length;
    });

    return stats;
  }

  // Export logs to file
  async exportLogs(filename: string, level?: LogLevel): Promise<void> {
    const fs = require('fs').promises;
    const logs = this.getLogs(level);
    const content = logs.map(log => JSON.stringify(log)).join('\n');
    await fs.writeFile(filename, content);
  }
} 