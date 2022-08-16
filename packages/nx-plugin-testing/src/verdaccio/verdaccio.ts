import { ChildProcess, execSync, fork } from "node:child_process";
import path from "node:path";
import { getPortPromise as getOpenPort } from "portfinder";

export class Verdaccio {
  private process!: ChildProcess;
  private url!: string;

  public async start(): Promise<void> {
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
          this.initialize(port, child);
          resolve();
        }
      });
      child.on("error", (error: any) => reject(error));
      child.on("disconnect", (error: any) => reject(error));
    });
  }

  public stop() {
    this.logout();

    this.process.kill();
  }

  public publish(packagePath: string) {
    execSync(`npm publish --registry=${this.url}`, {
      cwd: packagePath,
    });
  }

  public npx(command: string, cwd = process.cwd()) {
    execSync(`npx ${command}`, {
      cwd,
      env: {
        ...process.env,
        npm_config_registry: this.url,
      },
    });
  }

  public getUrl() {
    return this.url;
  }

  private initialize(port: number, process: ChildProcess) {
    this.process = process;
    this.url = `http://localhost:${port}`;

    this.login();
  }

  private login() {
    execSync(
      `npx npm-cli-login -u chiubaka -p test -e test@chiubaka.com -r ${this.url}`,
    );
  }

  private logout() {
    execSync(`npm logout --registry=${this.url}`);
  }
}
