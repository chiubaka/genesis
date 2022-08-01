import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { Linter } from "eslint";

import { eslintGenerator } from "../../src/generators/linting/eslint";

describe("eslintGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    eslintGenerator(tree);
  });

  describe("adds the appropriate dependencies", () => {
    it("adds @chiubaka/eslint-config as a devDependency", () => {
      expect(tree).toHaveDevDependency("@chiubaka/eslint-config");
    });

    it("adds eslint as a devDependency", () => {
      expect(tree).toHaveDevDependency("eslint");
    });

    it("adds @nrwl/eslint-plugin-nx as a devDependency", () => {
      expect(tree).toHaveDevDependency("@nrwl/eslint-plugin-nx");
    });
  });

  it("creates a root .eslintrc.json file", () => {
    expect(tree.exists(".eslintrc.json")).toBe(true);
  });

  describe(".eslintrc.json", () => {
    let eslintrc: Linter.Config;

    beforeAll(() => {
      eslintrc = readJson<Linter.Config>(tree, ".eslintrc.json");
    });

    it("marks this config as the root", () => {
      expect(eslintrc.root).toBe(true);
    });

    it("extends from @chiubaka/eslint-config", () => {
      expect(eslintrc.extends).toBe("@chiubaka/eslint-config");
    });

    it("sets the ignorePatterns", () => {
      expect(eslintrc.ignorePatterns).toEqual([
        "e2e",
        "node_modules",
        "packages",
        "tmp",
      ]);
    });

    it("includes the `@nrwl/nx` plugin", () => {
      expect(eslintrc.plugins).toContain("@nrwl/nx");
    });
  });
});
