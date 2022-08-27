import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { Project } from "../../../../src";
import { nodeAppGenerator } from "../../../../src/generators";
import { nodeProjectTestCases } from "../../../cases";

describe("nodeAppGenerator", () => {
  let tree: Tree;
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-app", "application");

    const projectScope = project.getScope();
    const projectName = project.getName();

    tree.write(
      "README.md",
      `[![codecov](https://codecov.io/gh/${projectScope}/${projectName}/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/${projectScope}/${projectName})`,
    );

    await nodeAppGenerator(tree, {
      scope: "chiubaka",
      name: "node-app",
    });
  });

  nodeProjectTestCases(getProject);
});
