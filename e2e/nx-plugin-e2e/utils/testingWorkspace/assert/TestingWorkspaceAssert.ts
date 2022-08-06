import { AbstractTestingWorkspace } from "../AbstractTestingWorkspace";
import { FsAssert } from "./fs";
import { GitAssert } from "./git";
import { LintingAssert } from "./linting";

export class TestingWorkspaceAssert {
  public fs: FsAssert;
  public git: GitAssert;
  public linting: LintingAssert;

  constructor(workspace: AbstractTestingWorkspace) {
    this.fs = new FsAssert(workspace.utils.fs);
    this.git = new GitAssert(workspace.utils.git);
    this.linting = new LintingAssert(workspace);
  }
}
