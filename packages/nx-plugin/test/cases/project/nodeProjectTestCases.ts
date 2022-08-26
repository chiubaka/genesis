import { Project } from "../../utils";
import { eslintProjectTestCases } from "./eslintProjectTestCases";
import { jestProjectTestCases } from "./jestProjectTestCases";
import { projectTestCases } from "./projectTestCases";
import { readmeProjectTestCases } from "./readmeProjectTestCases";
import { tsConfigTestCases } from "./tsConfigTestCases";

/**
 * Configures common test cases that should be included for all node project generators
 * @param projectName name of the project being tested
 */
export const nodeProjectTestCases = (project: Project) => {
  const tree = project.getTree();

  describe(".babelrc", () => {
    it("does not generate a .babelrc file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".babelrc"))).toBe(false);
    });
  });

  projectTestCases(project);
  jestProjectTestCases(project, "node");
  tsConfigTestCases(project, {
    lib: ["es2022"],
    module: "commonjs",
    target: "es2022",
  });
  eslintProjectTestCases(project);
  readmeProjectTestCases(project);
};
