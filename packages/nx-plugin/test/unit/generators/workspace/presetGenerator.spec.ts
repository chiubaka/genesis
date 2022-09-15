import { NxJsonConfiguration, readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { PackageJson } from "nx/src/utils/package-json";

import {
  presetGenerator,
  PresetGeneratorSchema,
} from "../../../../src/generators";

describe("presetGenerator", () => {
  let tree: Tree;
  const options: PresetGeneratorSchema = {
    workspaceName: "preset",
    workspaceScope: "chiubaka",
    description: "Testing for the preset generator",

    disableImmutableInstalls: false,
    skipInstall: true,
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    tree.write("apps/.gitkeep", "");
    tree.write("libs/.gitkeep", "");
    await presetGenerator(tree, options);
  });

  describe("package.json", () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      packageJson = readJson<PackageJson>(tree, "package.json");
    });

    it("sets up yarn workspaces to pick up packages in the packages dir", () => {
      packageJson = readJson<PackageJson>(tree, "package.json");

      expect(packageJson.workspaces).toEqual({
        packages: ["packages/*"],
      });
    });

    describe("scripts", () => {
      let scripts: Record<string, string> | undefined;

      beforeAll(() => {
        scripts = packageJson.scripts;
      });

      it("includes a build:affected script", () => {
        expect(scripts?.["build:affected"]).toBe("nx affected --target=build");
      });

      it("includes a build:ci script", () => {
        expect(scripts?.["build:ci"]).toBe(
          "yarn build:affected --base=$NX_BASE --head=$NX_HEAD",
        );
      });

      it("includes a test:affected script", () => {
        expect(scripts?.["test:affected"]).toBe("nx affected --target=test");
      });

      it("includes a test:ci script", () => {
        expect(scripts?.["test:ci"]).toBe(
          "yarn test:affected --ci --coverage --base=$NX_BASE --head=$NX_HEAD && yarn test:e2e:affected --base=$NX_BASE --head=$NX_HEAD",
        );
      });

      it("includes a test:e2e script", () => {
        expect(scripts?.["test:e2e"]).toBe("nx run-many --target=e2e --all");
      });

      it("includes a test:e2e:affected script", () => {
        expect(scripts?.["test:e2e:affected"]).toBe("nx affected --target=e2e");
      });

      it("includes a deploy script", () => {
        expect(scripts?.["deploy"]).toBe(
          "nx deploy $@ --configuration=production",
        );
      });

      it("includes a deploy:ci script", () => {
        expect(scripts?.["deploy:ci"]).toBe("yarn deploy");
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
