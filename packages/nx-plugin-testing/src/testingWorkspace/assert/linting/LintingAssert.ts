import { uniq } from "@nx/plugin/testing";
import fs from "node:fs";

import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class LintingAssert {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public async canFixIssues() {
    const lintErrorsFilePath = this.writeLintErrors();
    await this.isNotClean();

    await this.workspace.linting.lintFix();

    await this.isClean();

    this.cleanUpLintErrors(lintErrorsFilePath);
  }

  public async canFixStagedIssues() {
    const lintErrorsFilePath = this.writeLintErrors();
    await this.isNotClean();

    await this.workspace.git.stageAllFiles();
    await this.workspace.linting.lintStaged();

    await this.isClean();

    this.cleanUpLintErrors(lintErrorsFilePath);
    await this.workspace.git.unstageFile(lintErrorsFilePath);
  }

  public hasValidConfig() {
    return expect(
      this.workspace.linting.validateConfig(),
    ).resolves.not.toThrow();
  }

  public isClean() {
    return expect(this.workspace.linting.lint()).resolves.not.toThrow();
  }

  public isNotClean() {
    return expect(this.workspace.linting.lint()).rejects.toThrow();
  }

  private writeLintErrors() {
    const lintErrorsFilePath = `${uniq("fixableLintErrors")}.ts`;
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    fs.writeFileSync(
      this.workspace.path(lintErrorsFilePath),
      "export const hello = 'Hello, world!'",
    );

    return lintErrorsFilePath;
  }

  private cleanUpLintErrors(lintErrorsFilePath: string) {
    fs.rmSync(this.workspace.path(lintErrorsFilePath));
  }
}
