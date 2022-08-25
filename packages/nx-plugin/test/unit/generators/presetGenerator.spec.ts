import { NxJsonConfiguration, readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { PackageJson } from "nx/src/utils/package-json";

import {
  presetGenerator,
  PresetGeneratorSchema,
} from "../../../src/generators/preset";

describe("preset generator", () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    workspaceName: "preset",
    workspaceScope: "chiubaka",
    description: "Testing for the preset generator",

    skipInstall: true,
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write("apps/.gitkeep", "");
    tree.write("libs/.gitkeep", "");
    await presetGenerator(tree, options);
  });

  describe("package.json", () => {
    it("sets up yarn workspaces to pick up packages in the packages dir", () => {
      const packageJson = readJson<PackageJson>(tree, "package.json");

      expect(packageJson.workspaces).toEqual({
        packages: ["packages/*"],
      });
    });
  });

  describe("workspace layout", () => {
    it("should create an e2e dir", () => {
      expect(tree.exists("e2e")).toBe(true);
    });

    it("should create a packages dir", () => {
      expect(tree.exists("packages")).toBe(true);
    });

    it("should not create an apps dir", () => {
      expect(tree.exists("apps")).toBe(false);
    });

    it("should not create a libs dir", () => {
      expect(tree.exists("libs")).toBe(false);
    });

    it("should update workspaceLayout in nx.json", () => {
      const nxJson = readJson<NxJsonConfiguration>(tree, "nx.json");

      expect(nxJson.workspaceLayout).toEqual({
        appsDir: "e2e",
        libsDir: "packages",
      });
    });
  });

  describe("testing", () => {
    it("generates a Codecov configuration file", () => {
      expect(tree.exists("codecov.yml")).toBe(true);
    });
  });

  describe("CI", () => {
    it("generates a .circleci/config.yml file", () => {
      expect(tree.exists(".circleci/config.yml")).toBe(true);
    });
  });
});
