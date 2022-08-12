import winston from "winston";

import { Logger, LoggerOptions, LoggerOutputOptions } from "../Logger";
import { NxLoggerTransport } from "./NxLoggerTransport";

export class WinstonLogger extends Logger {
  private logger: winston.Logger;

  constructor(options: LoggerOptions) {
    super();

    this.logger = winston.createLogger({
      level: options.level,
      format: winston.format.simple(),
      transports: this.configureTransports(options.output),
    });
  }

  public error(message: string) {
    this.logger.error(message);
  }

  public warn(message: string) {
    this.logger.warn(message);
  }

  public info(message: string) {
    this.logger.info(message);
  }

  public verbose(message: string) {
    this.logger.verbose(message);
  }

  public debug(message: string) {
    this.logger.debug(message);
  }

  private configureTransports(
    options: LoggerOutputOptions = {},
  ): winston.transport[] {
    const transports = [];

    if (options.console) {
      transports.push(new NxLoggerTransport());
    }

    if (options.file) {
      options.file.map(({ path, level }) => {
        transports.push(new winston.transports.File({ filename: path, level }));
      });
    }

    return transports;
  }
}
