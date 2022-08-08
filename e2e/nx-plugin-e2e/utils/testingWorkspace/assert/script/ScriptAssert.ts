import { AbstractTestingWorkspace } from "../../AbstractTestingWorkspace";

export class ScriptAssert {
  private workspace: AbstractTestingWorkspace;

  constructor(workspace: AbstractTestingWorkspace) {
    this.workspace = workspace;
  }

  public runsSuccessfully(script: string, args?: string) {
    return expect(
      this.workspace.execPmcScript(script, args),
    ).resolves.not.toThrow();
  }
}
