import { ChildProcess, fork } from "node:child_process";
import path from "node:path";
import { getPortPromise as getOpenPort } from "portfinder";

export const startVerdaccio = async (): Promise<{
  port: number;
  process: ChildProcess;
  url: string;
}> => {
  const configPath = path.join(__dirname, "../../verdaccio.yml");

  const port = await getOpenPort();

  return new Promise((resolve, reject) => {
    const child = fork(require.resolve("verdaccio/bin/verdaccio"), [
      "-c",
      configPath,
      "-l",
      `${port}`,
    ]);

    child.on("message", (message: { verdaccio_started: boolean }) => {
      if (message.verdaccio_started) {
        resolve({
          port,
          process: child,
          url: `http://localhost:${port}`,
        });
      }
    });
    child.on("error", (error: any) => reject(error));
    child.on("disconnect", (error: any) => reject(error));
  });
};
