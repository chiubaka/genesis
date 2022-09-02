import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

describe("tsLibGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    const destination = e2eTmpPath("genesis-lib-e2e");
    workspace = new TestingWorkspace(destination);

    await workspace.execNx("generate @chiubaka/nx-plugin:lib.ts --name=ts-lib");
  });

  it("generates a project with a working testing setup", async () => {
    await expect(workspace.execNx("test ts-lib")).resolves.not.toThrow();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(workspace.execNx("lint ts-lib")).resolves.not.toThrow();
  });

  it("generates a project with a working build setup", async () => {
    await expect(workspace.execNx("build ts-lib")).resolves.not.toThrow();
  });

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
