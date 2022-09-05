import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

interface E2eProjectTestCasesOptions {
  buildable?: boolean;
}

export function e2eProjectTestCases(
  projectName: string,
  getWorkspace: () => TestingWorkspace,
  options: E2eProjectTestCasesOptions = {},
) {
  const { buildable } = options;

  let workspace: TestingWorkspace;

  beforeAll(() => {
    workspace = getWorkspace();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(
      workspace.execNx(`lint ${projectName}`),
    ).resolves.not.toThrow();
  });

  if (buildable) {
    it("generates a project with a working build setup", async () => {
      await expect(
        workspace.execNx(`build ${projectName}`),
      ).resolves.not.toThrow();
    });
  }

  it("generates a project with a working E2E setup", async () => {
    await expect(workspace.execNx(`e2e ${projectName}`)).resolves.not.toThrow();
  });
}
