import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

export function projectTestCases(
  projectName: string,
  getWorkspace: () => TestingWorkspace,
) {
  let workspace: TestingWorkspace;

  beforeAll(() => {
    workspace = getWorkspace();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(
      workspace.execNx(`lint ${projectName}`),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working build setup", async () => {
    await expect(
      workspace.execNx(`build ${projectName}`),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working testing setup", async () => {
    await expect(
      workspace.execNx(`test ${projectName}`),
    ).resolves.not.toThrow();
  });
}
