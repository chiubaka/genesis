import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

// eslint-disable-next-line jest/no-disabled-tests
describe.skip("nodeAppGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    const destination = e2eTmpPath("genesis-lib-e2e");
    workspace = new TestingWorkspace(destination);

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:app.node --name=node-app",
    );
  });

  it("generates a project with a working testing setup", async () => {
    await expect(workspace.execNx("test node-app")).resolves.not.toThrow();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(workspace.execNx("lint node-app")).resolves.not.toThrow();
  });

  it("generates a project with a working build setup", async () => {
    await expect(workspace.execNx("build node-app")).resolves.not.toThrow();
  });

  it.todo("generates a project with a working E2E setup");
});
