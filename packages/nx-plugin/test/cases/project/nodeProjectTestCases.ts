import { Tree } from "@nrwl/devkit";

import { Project } from "../../../src";
import { eslintProjectTestCases } from "./eslintProjectTestCases";
import { jestProjectTestCases } from "./jestProjectTestCases";
import { projectTestCases } from "./projectTestCases";
import { readmeProjectTestCases } from "./readmeProjectTestCases";
import { tsconfigTestCases } from "./tsconfigTestCases";

/**
 * Configures common test cases that should be included for all node project generators
 * @param projectName name of the project being tested
 */
export const nodeProjectTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
  });

  describe(".babelrc", () => {
    it("does not generate a .babelrc file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".babelrc"))).toBe(false);
    });
  });

  projectTestCases(getProject);
  jestProjectTestCases(getProject, "node");
  tsconfigTestCases(getProject, {
    appLibTypes: ["node"],
    compilerOptions: {
      lib: ["es2022"],
      module: "commonjs",
      target: "es2022",
    },
  });
  eslintProjectTestCases(getProject);
  readmeProjectTestCases(getProject);
};
