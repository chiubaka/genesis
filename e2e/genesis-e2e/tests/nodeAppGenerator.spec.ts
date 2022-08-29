import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

describe("nodeAppGenerator", () => {
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
});
