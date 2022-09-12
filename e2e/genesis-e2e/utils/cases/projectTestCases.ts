import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

export interface ProjectTestCasesOptions {
  skipBuild?: boolean;
  skipTest?: boolean;
}

export function projectTestCases(
  projectName: string,
  getWorkspace: () => TestingWorkspace,
  options: ProjectTestCasesOptions = {},
) {
  const { skipBuild, skipTest } = options;

  let workspace: TestingWorkspace;

  beforeAll(() => {
    workspace = getWorkspace();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(
      workspace.execNx(`lint ${projectName} --max-warnings 0`),
    ).resolves.not.toThrow();
  });

  if (!skipBuild) {
    it("generates a project with a working build setup", async () => {
      await expect(
        workspace.execNx(`build ${projectName}`),
      ).resolves.not.toThrow();
    });
  }

  if (!skipTest) {
    it("generates a project with a working testing setup", async () => {
      await expect(
        workspace.execNx(`test ${projectName}`),
      ).resolves.not.toThrow();
    });
  }
}
