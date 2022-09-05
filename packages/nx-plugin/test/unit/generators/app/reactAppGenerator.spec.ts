import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, reactAppGenerator } from "../../../../src";
import { reactProjectTestCases } from "../../../cases";

describe("reactAppGenerator", () => {
  let tree: Tree;
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "react-app", "application");
  });

  reactProjectTestCases(getProject, {
    projectJson: {
      targetNames: [
        "lint",
        "build",
        "test",
        "serve",
        "storybook",
        "build-storybook",
      ],
    },
  });

  beforeAll(async () => {
    await reactAppGenerator(tree, {
      name: "react-app",
    });
  });
});
