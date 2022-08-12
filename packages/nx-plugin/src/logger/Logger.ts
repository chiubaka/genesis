export interface LoggerOptions {
  level: LogLevel;
  output?: LoggerOutputOptions;
}

export interface LoggerOutputOptions {
  console?: boolean;
  file?: FileOutputOptions[];
}

export interface FileOutputOptions {
  path: string;
  level?: LogLevel;
}

export enum LogLevel {
  Error = "error",
  Warn = "warn",
  Info = "info",
  Verbose = "verbose",
  Debug = "debug",
}

export abstract class Logger {
  public abstract error(message: string): void;
  public abstract warn(message: string): void;
  public abstract info(message: string): void;
  public abstract verbose(message: string): void;
  public abstract debug(message: string): void;
}
