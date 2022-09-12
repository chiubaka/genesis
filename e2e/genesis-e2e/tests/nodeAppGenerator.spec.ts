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

  projectTestCases("node-app", getWorkspace);

  it.todo("generates a project with a working E2E setup");
});
