import { e2eTmpPath, TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import { projectTestCases } from "../utils";

describe("reactAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    const destination = e2eTmpPath("genesis-lib-e2e");
    workspace = new TestingWorkspace(destination);

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:app.react --name=react-app",
    );
  });

  projectTestCases("node-app", getWorkspace);
});
