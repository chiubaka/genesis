import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  copyWorkspaceTemplate,
  e2eProjectTestCases,
  projectTestCases,
} from "../utils";

describe("nodeLibGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("lib.node");

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

  it("generates a project with a working publish setup", async () => {
    await expect(
      workspace.execNx(
        "deploy node-lib --configuration=production --dry-run=true",
      ),
    ).resolves.not.toThrow();
  });

  describe("e2e project", () => {
    e2eProjectTestCases("node-lib-e2e", getWorkspace);
  });
});
