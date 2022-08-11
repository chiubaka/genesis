import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { tsconfigGenerator } from "../../src/generators";

interface TsConfig {
  extends?: string;
  compilerOptions?: {
    baseUrl?: string;
    rootDir?: string;

    paths?: Record<string, string>;
  };
}

describe("tsconfigGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    tsconfigGenerator(tree);
  });

  describe("package.json", () => {
    it("adds @chiubaka/tsconfig as a devDependency", () => {
      expect(tree).toHaveDevDependency("@chiubaka/tsconfig");
    });

    it("adds tslib as a devDependency", () => {
      expect(tree).toHaveDevDependency("tslib");
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
