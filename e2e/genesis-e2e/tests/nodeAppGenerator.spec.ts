import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { copyWorkspaceTemplate, projectTestCases } from "../utils";

describe("nodeAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.node");

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:app.node --name=node-app",
    );
  });

  it("generates a single lib project", () => {
    workspace.assert.fs.hasChildDirectories("packages", ["node-app"]);
  });

  // TODO: Node App generator currently does not generate an E2E test project
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("generates a single E2E project", () => {
    workspace.assert.fs.hasChildDirectories("e2e", ["node-app-e2e"]);
  });

  projectTestCases("node-app", getWorkspace);

  it.todo("generates a project with a working E2E setup");
});
