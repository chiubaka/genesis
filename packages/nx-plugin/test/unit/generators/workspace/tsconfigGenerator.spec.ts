import { readJson, Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { tsconfigGenerator } from "../../../../src/generators";
import { DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION } from "../../../mocks";
import { TsConfig } from "../../../types/tsconfig";

describe("tsconfigGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await tsconfigGenerator(tree);
  });

  describe("package.json", () => {
    it("adds @chiubaka/tsconfig as a devDependency", () => {
      expect(tree).toHaveDevDependency(
        "@chiubaka/tsconfig",
        DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
      );
    });

    it("adds tslib as a devDependency", () => {
      expect(tree).toHaveDevDependency(
        "tslib",
        DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
      );
    });
  });

  it("creates a tsconfig.base.json file", () => {
    expect(tree.exists("tsconfig.base.json")).toBe(true);
  });

  describe("tsconfig.base.json", () => {
    let tsconfig: TsConfig;

    beforeAll(() => {
      tsconfig = readJson<TsConfig>(tree, "tsconfig.base.json");
    });

    it("extends from @chiubaka/tsconfig", () => {
      expect(tsconfig.extends).toBe("@chiubaka/tsconfig");
    });

    it("sets the baseUrl to the monorepo root", () => {
      expect(tsconfig.compilerOptions?.baseUrl).toBe(".");
    });

    it("sets the rootDir to the monorepo root", () => {
      expect(tsconfig.compilerOptions?.rootDir).toBe(".");
    });

    it("creates an empty paths property", () => {
      expect(tsconfig.compilerOptions?.paths).toEqual({});
    });
  });
});
