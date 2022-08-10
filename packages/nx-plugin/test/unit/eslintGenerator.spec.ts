import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { Linter } from "eslint";
import { PackageJson } from "nx/src/utils/package-json";

import { eslintGenerator } from "../../src/generators/linting";

describe("eslintGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    eslintGenerator(tree, { packageManager: "yarn" });
  });

  describe("package.json", () => {
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

    describe("adds linting scripts", () => {
      let scripts: PackageJson["scripts"];

      beforeAll(() => {
        const packageJson = readJson<PackageJson>(tree, "package.json");
        scripts = packageJson.scripts;
      });

      it("adds a lint script", () => {
        expect(scripts.lint).toBe("nx lint");
      });

      it("adds a lint:affected script", () => {
        expect(scripts["lint:affected"]).toBe("nx affected --target=lint");
      });

      it("adds a lint:all scripts", () => {
        expect(scripts["lint:all"]).toBe(
          "yarn lint:root && yarn lint:packages",
        );
      });

      it("adds a lint:ci script", () => {
        expect(scripts["lint:ci"]).toBe(
          "yarn lint:root && yarn lint:affected --base=$NX_BASE --head=$NX_HEAD",
        );
      });

      it("adds a lint:fix:all script", () => {
        expect(scripts["lint:fix:all"]).toBe(
          "yarn lint:fix:root; yarn lint:fix:packages",
        );
      });

      it("adds a lint:fix:packages script", () => {
        expect(scripts["lint:fix:packages"]).toBe("yarn lint:packages --fix");
      });

      it("adds a lint:fix:root script", () => {
        expect(scripts["lint:fix:root"]).toBe("yarn lint:root --fix");
      });

      it("adds a lint:packages script", () => {
        expect(scripts["lint:packages"]).toBe(
          "nx run-many --target=lint --all",
        );
      });

      it("adds a lint:root script", () => {
        expect(scripts["lint:root"]).toBe("yarn eslint .");
      });
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
