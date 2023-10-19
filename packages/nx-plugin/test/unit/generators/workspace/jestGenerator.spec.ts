import { Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { compatiblePackageVersions, NX_VERSION } from "../../../../src";
import { jestGenerator } from "../../../../src/generators";
import { DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION } from "../../../mocks";

describe("jestGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write(".gitignore", "# compiled output\n/dist\n\n");
    await jestGenerator(tree);
  });

  describe(".gitignore", () => {
    it("adds /reports to .gitignore", () => {
      expect(tree).toHaveFileWithContent(".gitignore", "/reports\n");
    });
  });

  describe("package.json", () => {
    describe("adds the appropriate dependencies", () => {
      it("adds jest as a devDependency", () => {
        expect(tree).toHaveDevDependency(
          "jest",
          compatiblePackageVersions["jest"],
        );
      });

      it("adds @nx/jest as a devDependency", () => {
        expect(tree).toHaveDevDependency("@nx/jest", NX_VERSION);
      });

      it("adds ts-jest as a devDependency", () => {
        expect(tree).toHaveDevDependency(
          "ts-jest",
          compatiblePackageVersions["ts-jest"],
        );
      });

      it("adds jest-junit as a devDependency", () => {
        expect(tree).toHaveDevDependency(
          "jest-junit",
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
