import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { nodeAppGenerator } from "../../../../src/generators";
import { nodeProjectTestCases } from "../../../cases";
import { Project } from "../../../utils";

describe("nodeAppGenerator", () => {
  const tree = createTreeWithEmptyWorkspace();
  const project = new Project(tree, "node-app", "application");

  beforeAll(async () => {
    await nodeAppGenerator(tree, {
      scope: "chiubaka",
      name: "node-app",
    });
  });

  nodeProjectTestCases(project);
});
