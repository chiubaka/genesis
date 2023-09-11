import { readJson, Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { gitHubGenerator, PackageJson } from "../../../../src";

describe("githubGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    gitHubGenerator(tree, {
      organization: "chiubaka",
      privateRepository: true,
      repositoryDescription: "Test repository for githubGenerator unit tests",
      repositoryName: "test",

      forcePush: false,
      pushToRemote: false,
    });
  });

  describe("package.json", () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      packageJson = readJson<PackageJson>(tree, "package.json");
    });

    it("updates the repository section", () => {
      expect(packageJson.repository).toEqual({
        type: "git",
        url: "git+ssh://git@github.com/chiubaka/test.git",
      });
    });

    it("updates the bugs section", () => {
      expect(packageJson.bugs).toEqual({
        url: "https://github.com/chiubaka/test/issues",
      });
    });

    it("updates the homepage value", () => {
      expect(packageJson.homepage).toBe(
        "https://github.com/chiubaka/test#readme",
      );
    });
  });
});
