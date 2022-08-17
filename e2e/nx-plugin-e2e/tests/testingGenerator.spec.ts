import {
  createTestingWorkspace,
  TestingWorkspace,
} from "@chiubaka/nx-plugin-testing";

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

  describe("jest", () => {
    it("generates a jest.config.ts file", () => {
      workspace.assert.fs.exists("jest.config.ts");
    });

    it("generates a jest.preset.js file", () => {
      workspace.assert.fs.exists("jest.preset.js");
    });
  });

  describe("codecov", () => {
    it("generates a Codecov configuration file", () => {
      workspace.assert.fs.exists("codecov.yml");
    });
  });
});
