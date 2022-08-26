import { readJson } from "@nrwl/devkit";
import { Linter } from "eslint";

import { Project } from "../../utils";

export const eslintProjectTestCases = (project: Project) => {
  const tree = project.getTree();

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
