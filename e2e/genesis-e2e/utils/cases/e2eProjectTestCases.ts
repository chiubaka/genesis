import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

type E2eProjectTestCasesOptions = Omit<ProjectTestCasesOptions, "skipTest">;

export function e2eProjectTestCases(
  projectName: string,
  getWorkspace: () => TestingWorkspace,
  options: E2eProjectTestCasesOptions = {},
) {
  let workspace: TestingWorkspace;

  beforeAll(() => {
    workspace = getWorkspace();
  });

  projectTestCases(projectName, getWorkspace, { ...options, skipTest: true });

  it("generates a project with a working E2E setup", async () => {
    await expect(workspace.execNx(`e2e ${projectName}`)).resolves.not.toThrow();
  });
}
