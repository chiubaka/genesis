import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class LintingUtils {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public lint() {
    return this.workspace.execPmc("eslint .");
  }

  public lintFix() {
    return this.workspace.execPmc("eslint --fix .");
  }

  public lintStaged() {
    return this.workspace.execPmc("lint-staged");
  }

  public validateConfig() {
    return this.workspace.execPmc("eslint --print-config package.json");
  }
}
