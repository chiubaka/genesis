import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { projectTestCases } from "../utils";

describe("tsLibGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    const destination = e2eTmpPath("genesis-lib-e2e");
    workspace = new TestingWorkspace(destination);

    await workspace.execNx("generate @chiubaka/nx-plugin:lib.ts --name=ts-lib");
  });

  projectTestCases("ts-lib", getWorkspace);

  it("produces a library project that can be consumed by another project", async () => {
    await expect(workspace.execNx("e2e ts-lib-e2e")).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    it("generates a project with a working linting setup", async () => {
      await expect(
        workspace.execNx("lint ts-lib-e2e --max-warnings 0"),
      ).resolves.not.toThrow();
    });

    it("generates a project with a working build setup", async () => {
      await expect(workspace.execNx("build ts-lib-e2e")).resolves.not.toThrow();
    });
  });
});
