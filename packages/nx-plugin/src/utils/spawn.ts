import { spawn as originalSpawn, SpawnOptions } from "node:child_process";

export const spawn = (command: string, options: SpawnOptions) => {
  return new Promise<void>((resolve, reject) => {
    const child = originalSpawn(command, {
      ...options,
      shell: true,
    });

    const errors: string[] = [];

    child.on("error", (error) => {
      errors.push(error.toString());
    });

    child.on("close", () => {
      if (errors.length > 0) {
        reject(errors.join(""));
      } else {
        resolve();
      }
    });
  });
};
