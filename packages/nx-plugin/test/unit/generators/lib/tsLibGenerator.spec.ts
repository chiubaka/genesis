import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, tsLibGenerator } from "../../../../src";
import { libTestCases, tsProjectTestCases } from "../../../cases";

describe("tsLibGenerator", () => {
  let tree: Tree;
  let project: Project;

  let projectName: string;

  const getProject = () => {
    return project;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "ts-lib", "library");

    projectName = project.getName();
  });

  libTestCases(getProject);
  tsProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test"],
    },
  });

  beforeAll(async () => {
    await tsLibGenerator(tree, {
      name: projectName,
      skipE2e: false,
    });
  });
});
