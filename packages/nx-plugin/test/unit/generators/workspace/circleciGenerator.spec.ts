import { Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

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

    it("matches snapshot", () => {
      expect(config).toMatchSnapshot();
    });

    it("includes the chiubaka/circleci-orb", () => {
      expect(config.orbs?.chiubaka).toContain("chiubaka/circleci-orb");
    });

    it("is a setup config", () => {
      expect(config.setup).toBe(true);
    });

    it("defines a dynamic-setup workflow", () => {
      expect(config.workflows["dynamic-setup"]).toBeDefined();
    });
  });

  describe(".circleci/react-native.template.yml", () => {
    let config: CircleCiConfig;

    beforeAll(() => {
      config = readYaml<CircleCiConfig>(
        tree,
        ".circleci/react-native.template.yml",
      );
    });

    it("matches snapshot", () => {
      expect(config).toMatchSnapshot();
    });

    it("defines a lint-build-test-e2e-deploy workflow", () => {
      expect(config.workflows["lint-build-test-e2e-deploy"]).toBeDefined();
    });
  });

  describe(".circleci/js.template.yml", () => {
    let config: CircleCiConfig;

    beforeAll(() => {
      config = readYaml<CircleCiConfig>(tree, ".circleci/js.template.yml");
    });

    it("matches snapshot", () => {
      expect(config).toMatchSnapshot();
    });

    it("defines a lint-build-test-e2e-deploy workflow", () => {
      expect(config.workflows["lint-build-test-e2e-deploy"]).toBeDefined();
    });
  });
});
