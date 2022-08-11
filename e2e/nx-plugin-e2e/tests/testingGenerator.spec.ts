import { createTestingWorkspace, TestingWorkspace } from "../utils";

describe("testingGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "testing",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx("generate @chiubaka/nx-plugin:testing");
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  describe("testing", () => {
    it("generates a Codecov configuration file", () => {
      workspace.assert.fs.exists("codecov.yml");
    });
  });
});
