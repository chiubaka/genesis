import { AbstractTestingWorkspace } from "../AbstractTestingWorkspace";
import { FsAssert } from "./fs";
import { GitAssert } from "./git";
import { LintingAssert } from "./linting";
import { ScriptAssert } from "./script";

export class TestingWorkspaceAssert {
  public fs: FsAssert;
  public git: GitAssert;
  public linting: LintingAssert;
  public script: ScriptAssert;

  constructor(workspace: AbstractTestingWorkspace) {
    this.fs = new FsAssert(workspace.fs);
    this.git = new GitAssert(workspace.git);
    this.linting = new LintingAssert(workspace);
    this.script = new ScriptAssert(workspace);
  }
}
