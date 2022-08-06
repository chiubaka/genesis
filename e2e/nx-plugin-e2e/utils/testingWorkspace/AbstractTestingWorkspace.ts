import { PromiseWithChild } from "node:child_process";

import { TestingWorkspaceAssert } from "./assert";
import { TestingWorkspaceUtils } from "./utils";

export abstract class AbstractTestingWorkspace {
  public assert: TestingWorkspaceAssert;
  public utils: TestingWorkspaceUtils;

  protected rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
    this.utils = new TestingWorkspaceUtils(this);
    this.assert = new TestingWorkspaceAssert(this);
  }

  public abstract exec(
    command: string,
  ): PromiseWithChild<{ stdout: string; stderr: string }>;

  public abstract execNx(
    command: string,
  ): PromiseWithChild<{ stdout: string; stderr: string }>;

  public abstract path(relativePath: string): string;
}
