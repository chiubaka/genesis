import { TestingWorkspaceAssert } from "./assert";
import { FsUtils, GitUtils, LintingUtils } from "./utils";

export abstract class AbstractTestingWorkspace {
  public fs: FsUtils;
  public git: GitUtils;
  public linting: LintingUtils;

  public assert: TestingWorkspaceAssert;

  protected rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;

    this.fs = new FsUtils(this);
    this.git = new GitUtils(this);
    this.linting = new LintingUtils(this);

    this.assert = new TestingWorkspaceAssert(this);
  }

  public abstract exec(
    command: string,
  ): Promise<{ stdout: string; stderr: string }>;

  public abstract execNx(
    command: string,
  ): Promise<{ stdout: string; stderr: string }>;

  public abstract execPmc(
    command: string,
  ): Promise<{ stdout: string; stderr: string }>;

  public abstract execPmcScript(
    script: string,
    args?: string,
  ): Promise<{ stdout: string; stderr: string }>;

  public abstract path(relativePath: string): string;
}
