import {
  detectPackageManager,
  getPackageManagerCommand,
  readJsonFile,
  workspaceRoot as pluginWorkspaceRoot,
  writeJsonFile,
} from "@nx/devkit";
import { exec as nodeExec } from "node:child_process";
import { rmSync } from "node:fs";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";
import ora from "ora";

import { AbstractTestingWorkspace } from "./AbstractTestingWorkspace";

export class TestingWorkspace extends AbstractTestingWorkspace {
  constructor(rootPath: string) {
    super(rootPath);
  }

  public async exec(command: string, env?: NodeJS.ProcessEnv) {
    return new Promise<{ stdout: string; stderr: string }>(
      (resolve, reject) => {
        const spinner = ora(`Running ${command} in ${this.rootPath}`).start();
        nodeExec(
          command,
          {
            cwd: this.rootPath,
            maxBuffer: 1024 * 100_000,
            env,
          },
          (error, stdout, stderr) => {
            if (error) {
              spinner.fail(error.message);
              if (stdout !== "") {
                // eslint-disable-next-line no-console
                console.log(stdout);
              }
              if (stderr !== "") {
                console.error(stderr);
              }
              return reject(error);
            }

            spinner.succeed(`Ran ${command} in ${this.rootPath}`);
            resolve({
              stdout,
              stderr,
            });
          },
        );
      },
    );
  }

  public execNx(command: string) {
    return this.execPmc(`nx ${command}`, {
      ...process.env,
      NX_DAEMON: "false",
    });
  }

  public execPmc(command: string, env?: NodeJS.ProcessEnv) {
    const pmc = this.getPackageManagerCommand();
    return this.exec(`${pmc.exec} ${command}`, env);
  }

  public execPmcScript(script: string, args = "") {
    const pmc = this.getPackageManagerCommand();
    const command = pmc.run(script, args);
    return this.exec(command);
  }

  public getRoot() {
    return this.rootPath;
  }

  public path(relativePath: string) {
    return path.join(this.rootPath, relativePath);
  }

  public patchPackageJsonForPlugin(npmPackageName: string, distPath: string) {
    const path = this.path("package.json");
    const json = readJsonFile<PackageJson>(path);

    if (!json.devDependencies) {
      return;
    }

    const pluginPath = `${pluginWorkspaceRoot}/${distPath}`;

    // eslint-disable-next-line security/detect-object-injection
    json.devDependencies[npmPackageName] = `file:${pluginPath}`;

    writeJsonFile(path, json);
  }

  public runPackageManagerInstall() {
    const packageManager = detectPackageManager(this.rootPath);
    if (packageManager !== "npm") {
      rmSync(this.path("package-lock.json"), { force: true });
    }

    const pmc = this.getPackageManagerCommand();
    return this.exec(pmc.install);
  }

  private getPackageManagerCommand() {
    const packageManager = detectPackageManager(this.rootPath);
    return getPackageManagerCommand(packageManager);
  }
}
