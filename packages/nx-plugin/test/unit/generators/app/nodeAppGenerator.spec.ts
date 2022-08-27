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
    await nodeAppGenerator(tree, {
      scope: "chiubaka",
      name: "node-app",
    });

    project = new Project(tree, "node-app", "application");
  });

  nodeProjectTestCases(getProject);
});
