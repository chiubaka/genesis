import { uniq } from "@nrwl/nx-plugin/testing";
import fs from "node:fs";

import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class LintingAssert {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public async canFixIssues() {
    const lintErrorsFileName = `${uniq("fixableLintErrors")}.ts`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(
      this.workspace.path(lintErrorsFileName),
      "export const hello = 'Hello, world!'",
    );

    await expect(async () => {
      await this.workspace.exec("yarn run eslint .");
    }).rejects.toThrow();

    await this.workspace.exec("yarn run eslint --fix .");

    expect(async () => {
      await this.workspace.exec("yarn run eslint .");
    }).not.toThrow();

    fs.rmSync(this.workspace.path(lintErrorsFileName));
  }

  public hasValidConfig() {
    expect(async () => {
      await this.workspace.exec("yarn run eslint --print-config package.json");
    }).not.toThrow();
  }

  public isClean() {
    expect(async () => {
      await this.workspace.exec("yarn run eslint .");
    }).not.toThrow();
  }
}
