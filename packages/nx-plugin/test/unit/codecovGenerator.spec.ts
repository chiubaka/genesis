import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { codecovGenerator } from "../../src/generators";

describe("codecovGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    codecovGenerator(tree);
  });

  describe("codecov.yml", () => {
    it("creates a codecov.yml file in the workspace root", () => {
      expect(tree.exists("codecov.yml")).toBe(true);
    });
  });
});
