import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  copyWorkspaceTemplate,
  e2eProjectTestCases,
  projectTestCases,
} from "../utils";

describe.skip("reactAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.react");

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:app.react --name=react-app",
    );
  });

  projectTestCases("react-app", getWorkspace);

  describe("e2e project", () => {
    e2eProjectTestCases("react-app-e2e", getWorkspace, { skipBuild: true });
  });
});
