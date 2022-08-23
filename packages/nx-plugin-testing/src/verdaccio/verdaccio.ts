import { execSync } from "node:child_process";

export class Verdaccio {
  private url: string;

  constructor(url: string) {
    this.url = url;

    this.login();
  }

  public publish(packagePath: string) {
    execSync(`npm unpublish --force --registry=${this.url}`, {
      cwd: packagePath,
    });
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

  private login() {
    execSync(
      `npx npm-cli-login -u test -p test -e test@chiubaka.com -r ${this.url}`,
    );
  }
}
