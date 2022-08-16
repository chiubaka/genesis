import { AbstractTestingWorkspace } from "../AbstractTestingWorkspace";
import { FsUtils } from "./fs";
import { GitUtils } from "./git";
import { LintingUtils } from "./linting";

export class TestingWorkspaceUtils {
  public fs: FsUtils;
  public git: GitUtils;
  public linting: LintingUtils;

  constructor(workspace: AbstractTestingWorkspace) {
    this.fs = new FsUtils(workspace);
    this.git = new GitUtils(workspace);
    this.linting = new LintingUtils(workspace);
  }
}
