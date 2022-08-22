import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { PackageJson } from "nx/src/utils/package-json";

import { lintStagedGenerator } from "../../../../src/generators";
import { DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION } from "../../../mocks";

describe("lintStagedGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await lintStagedGenerator(tree);
  });

  describe("package.json", () => {
    it("adds lint-staged as a devDependency", () => {
      expect(tree).toHaveDevDependency(
        "lint-staged",
        DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
      );
    });

    it("adds a lint:staged script", () => {
      const packageJson = readJson<PackageJson>(tree, "package.json");

      expect(packageJson.scripts?.["lint:staged"]).toBe("lint-staged");
    });
  });

  it("creates a .lintstagedrc.yml file", () => {
    expect(tree.exists(".lintstagedrc.yml")).toBe(true);
  });
});
