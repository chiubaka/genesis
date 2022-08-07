import { AbstractTestingWorkspace } from "../AbstractTestingWorkspace";
import { FsUtils } from "./fs";
import { GitUtils } from "./git";

export class TestingWorkspaceUtils {
  public fs: FsUtils;
  public git: GitUtils;

  constructor(workspace: AbstractTestingWorkspace) {
    this.fs = new FsUtils(workspace);
    this.git = new GitUtils(workspace);
  }
}
