import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  copyWorkspaceTemplate,
  e2eProjectTestCases,
  projectTestCases,
} from "../utils";

describe("reactNativeLibGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("lib.react-native");

    await workspace.execNx(
      "generate @chiubaka/nx-plugin:lib.react-native --name=react-native-lib",
    );
  });

  projectTestCases("react-native-app", getWorkspace);

  describe("e2e project", () => {
    e2eProjectTestCases("react-native-lib-e2e", getWorkspace, {
      skipBuild: true,
    });
  });
});
