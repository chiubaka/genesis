import { createTestingWorkspace, TestingWorkspace } from "../utils";

jest.setTimeout(40_000);

describe("tsconfigGenerator", () => {
  let workspace: TestingWorkspace;

  beforeAll(async () => {
    workspace = await createTestingWorkspace(
      "tsconfig",
      "@chiubaka/nx-plugin",
      "dist/packages/nx-plugin",
    );

    await workspace.execNx("generate @chiubaka/nx-plugin:tsconfig");
  });

  afterAll(async () => {
    await workspace.execNx("reset");
  });

  it("generates a tsconfig.base.json file", () => {
    workspace.assert.fs.exists("tsconfig.base.json");
  });

  describe("tsconfig.base.json", () => {
    it("extends from @chiubaka/tsconfig", () => {
      workspace.assert.fs.jsonFileContents("tsconfig.base.json", {
        extends: "@chiubaka/tsconfig",
      });
    });
  });
});
