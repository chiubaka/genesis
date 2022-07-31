import { NxJsonConfiguration, readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import generator, { PrettierConfig } from "./generator";
import { PresetGeneratorSchema } from "./schema";

describe("preset generator", () => {
  let appTree: Tree;
  const options: PresetGeneratorSchema = { name: "test", skipInstall: true };

  beforeAll(async () => {
    appTree = createTreeWithEmptyWorkspace();
    appTree.write("apps/.gitkeep", "");
    appTree.write("libs/.gitkeep", "");
    await generator(appTree, options);
  });

  describe("workspace layout", () => {
    it("should create an e2e dir", () => {
      expect(appTree.exists("e2e")).toBe(true);
    });

    it("should create a packages dir", () => {
      expect(appTree.exists("packages")).toBe(true);
    });

    it("should not create an apps dir", () => {
      expect(appTree.exists("apps")).toBe(false);
    });

    it("should not create a libs dir", () => {
      expect(appTree.exists("libs")).toBe(false);
    });

    it("should update workspaceLayout in nx.json", () => {
      const nxJson = readJson<NxJsonConfiguration>(appTree, "nx.json");

      expect(nxJson.workspaceLayout).toEqual({
        appsDir: "e2e",
        libsDir: "packages",
      });
    });
  });

  describe(".prettierrc", () => {
    it("creates a .prettierrc file", () => {
      expect(appTree.exists(".prettierrc")).toBe(true);
    });

    it("should remove the singleQuote option", () => {
      const prettierConfig = readJson<PrettierConfig>(appTree, ".prettierrc");

      expect(prettierConfig.singleQuote).toBeUndefined();
    });
  });
});
