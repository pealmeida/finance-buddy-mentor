
/**
 * Centralized logging utility for consistent and controlled logging
 * Automatically disables in production unless explicitly enabled
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enableInProduction?: boolean;
  minLevel?: LogLevel;
}

const DEFAULT_OPTIONS: LoggerOptions = {
  enableInProduction: false,
  minLevel: 'info'
};

const LEVEL_PRIORITY = {
  'debug': 0,
  'info': 1,
  'warn': 2,
  'error': 3
};

class Logger {
  private options: LoggerOptions;
  private isProduction: boolean;
  
  constructor(options: LoggerOptions = DEFAULT_OPTIONS) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
    this.isProduction = process.env.NODE_ENV === 'production';
  }
  
  private shouldLog(level: LogLevel): boolean {
    if (this.isProduction && !this.options.enableInProduction) {
      return false;
    }
    
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.options.minLevel || 'info'];
  }
  
  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
  
  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }
  
  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }
  
  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, ...args);
    }
  }
  
  trace(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.trace(`[TRACE] ${message}`, ...args);
    }
  }
}

export const logger = new Logger();

// Example: Configure for different environments
if (process.env.NODE_ENV === 'development') {
  Object.assign(logger, new Logger({ minLevel: 'debug' }));
} else if (process.env.NODE_ENV === 'test') {
  Object.assign(logger, new Logger({ minLevel: 'warn' }));
} else {
  // Production: Only log errors by default
  Object.assign(logger, new Logger({ 
    enableInProduction: true,
    minLevel: 'error'
  }));
}
