import { TestingWorkspace } from "@chiubaka/nx-plugin-testing";

import {
  copyWorkspaceTemplate,
  e2eProjectTestCases,
  projectTestCases,
} from "../utils";

describe("reactNativeAppGenerator", () => {
  let workspace: TestingWorkspace;

  const getWorkspace = () => {
    return workspace;
  };

  beforeAll(async () => {
    workspace = await copyWorkspaceTemplate("app.react-native");

    await workspace.execNx(
      'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --displayName="React Native App"',
    );
  });

  projectTestCases("react-native-app", getWorkspace);

  describe("e2e project", () => {
    e2eProjectTestCases("react-native-app-e2e", getWorkspace, {
      skipBuild: true,
    });
  });
});
