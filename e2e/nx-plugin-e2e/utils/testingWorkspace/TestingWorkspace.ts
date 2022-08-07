import {
  detectPackageManager,
  getPackageManagerCommand,
  readJsonFile,
  workspaceRoot as pluginWorkspaceRoot,
  writeJsonFile,
} from "@nrwl/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { exec } from "../exec";
import { AbstractTestingWorkspace } from "./AbstractTestingWorkspace";

export class TestingWorkspace extends AbstractTestingWorkspace {
  constructor(rootPath: string) {
    super(rootPath);
  }

  public exec(command: string) {
    return exec(command, {
      cwd: this.rootPath,
    });
  }

  public execNx(command: string) {
    const pmc = this.getPackageManagerCommand();
    const commandPrefix = `${pmc.exec} nx`;
    return this.exec(`${commandPrefix} ${command}`);
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

    // eslint-disable-next-line security/detect-object-injection
    json.devDependencies[
      npmPackageName
    ] = `file:${pluginWorkspaceRoot}/${distPath}`;

    writeJsonFile(path, json);
  }

  public runPackageManagerInstall() {
    const pmc = this.getPackageManagerCommand();
    return this.exec(pmc.install);
  }

  private getPackageManagerCommand() {
    const packageManager = detectPackageManager(this.rootPath);
    return getPackageManagerCommand(packageManager);
  }
}
