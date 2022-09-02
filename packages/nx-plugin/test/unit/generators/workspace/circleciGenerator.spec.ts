import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { CircleCiConfig, circleciGenerator, readYaml } from "../../../../src";

describe("circleciGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    circleciGenerator(tree);
  });

  it("creates a .circleci/config.yml file", () => {
    expect(tree.exists(".circleci/config.yml")).toBe(true);
  });

  describe(".circleci/config.yml", () => {
    let config: CircleCiConfig;

    beforeAll(() => {
      config = readYaml<CircleCiConfig>(tree, ".circleci/config.yml");
    });

    it("includes the chiubaka/circleci-orb", () => {
      expect(config.orbs?.chiubaka).toContain("chiubaka/circleci-orb");
    });

    it("defines a lint-build-test-deploy workflow", () => {
      expect(config.workflows["lint-build-test-deploy"]).toBeDefined();
    });
  });
});
