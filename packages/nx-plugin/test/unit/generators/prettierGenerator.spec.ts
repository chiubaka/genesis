import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { PrettierConfig, prettierGenerator } from "../../../src/generators";

describe("prettierGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await prettierGenerator(tree);
  });

  it("adds prettier as a devDependency", () => {
    expect(tree).toHaveDevDependency("prettier");
    expect(tree).not.toHaveDevDependency("prettier", "latest");
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
