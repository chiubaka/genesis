import { readJsonFile } from "@nrwl/devkit";
import { readFile } from "@nrwl/nx-plugin/testing";
import fs from "node:fs";
import { writeJsonFile } from "nx/src/utils/fileutils";

import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class FsUtils {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public exists(relativePath: string) {
    const path = this.workspace.path(relativePath);

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return fs.existsSync(path);
  }

  public children(relativePath: string) {
    const path = this.workspace.path(relativePath);

    // eslint-disable-next-line security/detect-non-literal-fs-filename
    return fs.readdirSync(path, { withFileTypes: true });
  }

  public readFile(relativePath: string) {
    const path = this.workspace.path(relativePath);

    return readFile(path);
  }

  public readJsonFile<TJson extends object>(relativePath: string) {
    const path = this.workspace.path(relativePath);

    return readJsonFile<TJson>(path);
  }

  public writeJsonFile<TJson extends object>(
    relativePath: string,
    data: TJson,
  ) {
    const path = this.workspace.path(relativePath);

    writeJsonFile(path, data);
  }
}
