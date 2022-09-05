import { readJson, Tree } from "@nrwl/devkit";

import { PackageJson, Project } from "../../../src";
import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

/**
 * Configures common test cases that should be included for all node project generators
 * @param projectName name of the project being tested
 */
export const nodeProjectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions = {},
) => {
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

  describe("package.json", () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      packageJson = readJson(tree, project.path("package.json"));
    });

    describe("engines", () => {
      let engines: Record<string, string> | undefined;

      beforeAll(() => {
        engines = packageJson.engines;
      });

      it("specifies a node version under engines", () => {
        expect(engines?.node).toBe(">=16.0.0 <17.0.0");
      });

      it("specifies an npm version under engines", () => {
        expect(engines?.npm).toBe(">=8.1.0 <9.0.0");
      });
    });
  });

  describe("workspace", () => {
    describe(".nvmrc", () => {
      it("specifies the correct node version in .nvmrc", () => {
        expect(tree).toHaveFileWithContent(".nvmrc", "lts/gallium", {
          exact: true,
        });
      });
    });
  });

  projectTestCases(getProject, {
    ...options,
    jest: {
      testEnvironment: "node",
    },
    tsconfig: {
      appLibTypes: ["node"],
      compilerOptions: {
        lib: ["es2022"],
        module: "commonjs",
        target: "es2022",
      },
    },
  });
};
