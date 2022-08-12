import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { circleciGenerator } from "../../../src/generators/index";

describe("circleciGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    circleciGenerator(tree);
  });

  it("creates a .circleci/config.yml file", () => {
    expect(tree.exists(".circleci/config.yml")).toBe(true);
  });
});
