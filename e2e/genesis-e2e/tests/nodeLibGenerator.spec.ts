import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { projectTestCases } from "../utils";

describe("nodeLibGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    const destination = e2eTmpPath("genesis-lib-e2e");
    workspace = new TestingWorkspace(destination);

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:lib.node --name=node-lib",
    );
  });

  it("does not compile TS template files to JS", () => {
    workspace.assert.fs.notExists("libs/node-lib/src/index.js");
    workspace.assert.fs.notExists("libs/node-lib/src/index.js.map");
    workspace.assert.fs.notExists("libs/node-lib/src/index.d.ts");
    workspace.assert.fs.notExists("libs/node-lib/src/index.d.ts.map");

    workspace.assert.fs.notExists("libs/node-lib/src/hello.js");
    workspace.assert.fs.notExists("libs/node-lib/src/hello.js.map");
    workspace.assert.fs.notExists("libs/node-lib/src/hello.d.ts");
    workspace.assert.fs.notExists("libs/node-lib/src/hello.d.ts.map");

    workspace.assert.fs.notExists("libs/node-lib/test/hello.spec.js");
    workspace.assert.fs.notExists("libs/node-lib/test/hello.spec.js.map");
    workspace.assert.fs.notExists("libs/node-lib/test/hello.spec.d.ts");
    workspace.assert.fs.notExists("libs/node-lib/test/hello.spec.d.ts.map");
  });

  projectTestCases("node-lib", getWorkspace);

  it("generates a project with a working testing setup", async () => {
    await expect(workspace.execNx("test node-lib")).resolves.not.toThrow();
  });

  it("generates a project with a working linting setup", async () => {
    await expect(
      workspace.execNx("lint node-lib --max-warnings 0"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working build setup", async () => {
    await expect(workspace.execNx("build node-lib")).resolves.not.toThrow();
  });

  it("generates a project with a working publish setup", async () => {
    await expect(
      workspace.execNx("deploy node-lib --dry-run"),
    ).resolves.not.toThrow();
  });

  it("generates a project with a working CI publish setup", async () => {
    await expect(
      workspace.execNx("deploy:ci node-lib --dry-run"),
    ).resolves.not.toThrow();
  });

  it("produces a library project that can be consumed by another project", async () => {
    await expect(workspace.execNx("e2e node-lib-e2e")).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    it("generates a project with a working linting setup", async () => {
      await expect(
        workspace.execNx("lint node-lib-e2e --max-warnings 0"),
      ).resolves.not.toThrow();
    });

    it("generates a project with a working build setup", async () => {
      await expect(
        workspace.execNx("build node-lib-e2e"),
      ).resolves.not.toThrow();
    });
  });
});
