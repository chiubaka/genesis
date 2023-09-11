import { workspaceRoot } from "@nx/devkit";
import path from "node:path";

import { Logger, LoggerOptions, LogLevel } from "./Logger";
import { WinstonLogger } from "./winston";

export const createLogger = (
  name: string,
  options: Partial<LoggerOptions> = {},
): Logger => {
  return new WinstonLogger({
    level: LogLevel.Debug,
    ...options,
    output: {
      console: true,
      file: [
        {
          path: path.join(workspaceRoot, `tmp/${name}.log`),
        },
      ],
      ...options.output,
    },
  });
};

export const generatorLogger = createLogger("generator");
