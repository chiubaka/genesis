import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { jestGenerator } from "../../../../src/generators";
import { DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION } from "../../../mocks";

describe("jestGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await jestGenerator(tree);
  });

  describe("package.json", () => {
    describe("adds the appropriate dependencies", () => {
      it("adds jest as a devDependency", () => {
        expect(tree).toHaveDevDependency(
          "jest",
          DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
        );
      });

      it("adds @nrwl/jest as a devDependency", () => {
        expect(tree).toHaveDevDependency(
          "@nrwl/jest",
          DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
        );
      });
    });
  });

  describe("generates jest configuration files", () => {
    it("generates a jest.config.ts file", () => {
      expect(tree.exists("jest.config.ts")).toBe(true);
    });

    it("generates a jest.preset.js file", () => {
      expect(tree.exists("jest.preset.js")).toBe(true);
    });
  });
});
