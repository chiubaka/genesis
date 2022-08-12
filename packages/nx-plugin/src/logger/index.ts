import { Logger, LoggerOptions, LogLevel } from "./Logger";
import { WinstonLogger } from "./winston";

export const createLogger = (
  name: string,
  options: Partial<LoggerOptions> = {},
): Logger => {
  return new WinstonLogger({
    level: LogLevel.Info,
    ...options,
    output: {
      console: true,
      file: [
        {
          path: `${name}.log`,
        },
      ],
      ...options.output,
    },
  });
};

export const generatorLogger = createLogger("generator");
