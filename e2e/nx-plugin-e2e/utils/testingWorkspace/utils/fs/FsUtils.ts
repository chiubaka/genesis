import { readFile } from "@nrwl/nx-plugin/testing";
import fs from "node:fs";

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

  public readFile(relativePath: string) {
    const path = this.workspace.path(relativePath);

    return readFile(path);
  }
}
