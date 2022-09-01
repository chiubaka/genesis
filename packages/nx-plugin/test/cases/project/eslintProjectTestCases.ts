import { readJson, Tree } from "@nrwl/devkit";
import { Linter } from "eslint";

import { Project } from "../../../src";

export const eslintProjectTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
  });

  describe(".eslintrc.json", () => {
    let eslintConfig: Linter.Config;

    beforeAll(() => {
      eslintConfig = readJson<Linter.Config>(
        tree,
        project.path(".eslintrc.json"),
      );
    });

    it("generates a .eslintrc.json file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".eslintrc.json"))).toBe(true);
    });

    it("extends from the root monorepo .eslintrc.json file", () => {
      expect(eslintConfig.extends).toEqual(["../../.eslintrc.json"]);
    });

    it("only ignores node_modules", () => {
      expect(eslintConfig.ignorePatterns).toEqual(["node_modules"]);
    });
  });
};
