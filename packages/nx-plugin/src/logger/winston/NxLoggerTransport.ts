import { logger } from "@nrwl/devkit";
import Transport from "winston-transport";

import { LogLevel } from "../Logger";

interface LogData {
  message: string;
  level: LogLevel;
}

export class NxLoggerTransport extends Transport {
  public log(data: LogData, next: () => void) {
    const { level, message } = data;

    switch (level) {
      case LogLevel.Error:
        logger.error(message);
        break;
      case LogLevel.Warn:
        logger.warn(message);
        break;
      case LogLevel.Info:
        logger.info(message);
        break;
      case LogLevel.Verbose:
        logger.log(message);
        break;
      case LogLevel.Debug:
        logger.debug(message);
        break;
    }

    next();
  }
}
