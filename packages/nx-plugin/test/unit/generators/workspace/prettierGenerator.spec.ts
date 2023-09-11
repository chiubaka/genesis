import { readJson, Tree } from "@nx/devkit";
import { createTreeWithEmptyWorkspace } from "@nx/devkit/testing";

import { PrettierConfig, prettierGenerator } from "../../../../src/generators";

describe("prettierGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await prettierGenerator(tree);
  });

  it("adds prettier as a devDependency", () => {
    expect(tree).toHaveDevDependency("prettier", "^2.8.8");
  });

  it("creates a .prettierrc file", () => {
    expect(tree.exists(".prettierrc")).toBe(true);
  });

  describe(".prettierrc", () => {
    let prettierConfig: PrettierConfig;

    beforeAll(() => {
      prettierConfig = readJson<PrettierConfig>(tree, ".prettierrc");
    });

    it("sets the singleQuote option to false", () => {
      expect(prettierConfig.singleQuote).toBe(false);
    });

    it('sets the trailingComma option to "all"', () => {
      expect(prettierConfig.trailingComma).toBe("all");
    });
  });
});
