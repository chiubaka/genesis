import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nx/devkit";

import { Project, reactNativeAppGenerator } from "../../../../src";
import { projectTestCases } from "../../../cases/project/projectTestCases";

describe("reactNativeAppGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  const getProject = () => {
    return project;
  };

  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "react-app", "application");
    e2eProject = new Project(tree, "react-app-e2e", "e2e");
  });

  beforeAll(async () => {
    await reactNativeAppGenerator(tree, {
      name: "react-native-app",
      displayName: "React Native App",
    });
  });

  projectTestCases(getProject);
});
