import { readJson, Tree, updateJson } from "@nrwl/devkit";

import { PackageJson, Project } from "../../../src";
import { TsConfig } from "../../types/tsconfig";
import { eslintProjectTestCases } from "./eslintProjectTestCases";
import { jestProjectTestCases } from "./jestProjectTestCases";
import { projectJsonTestCases } from "./projectJsonTestCases";
import { readmeProjectTestCases } from "./readmeProjectTestCases";
import { tsconfigTestCases } from "./tsconfigTestCases";

export interface ProjectTestCasesOptions {
  repoName?: string;
}

/**
 * Configures common test cases that should be included for all project generators
 * @param projectName name of the project being tested
 * @param getProject
 * @param options
 */
export const projectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions = {},
) => {
  let project: Project;
  let tree: Tree;
  let projectScope: string;
  let projectName: string;
  let repoName: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();

    projectScope = project.getScope();
    projectName = project.getName();

    repoName = options.repoName || projectName;

    updateJson<PackageJson>(
      tree,
      "package.json",
      (packageJson: PackageJson) => {
        packageJson.repository = {
          type: "git",
          url: `git+ssh://git@github.com/${projectScope}/${repoName}.git`,
        };

        packageJson.bugs = {
          url: `https://github.com/${projectScope}/${repoName}/issues`,
        };

        packageJson.homepage = `https://github.com/${projectScope}/${repoName}#readme`;

        return packageJson;
      },
    );
  });

  it("generates a directory for the new project", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path())).toBe(true);
  });

  describe("workspace configurations", () => {
    describe("tsconfig.base.json", () => {
      it("updates paths to point to the newly generated project", () => {
        // Application-level code doesn't typically get shared around and reference by other projects
        if (project.getType() !== "library") {
          return;
        }

        const tsConfig = readJson<TsConfig>(tree, "tsconfig.base.json");
        const packageName = `@${projectScope}/${projectName}`;

        // eslint-disable-next-line security/detect-object-injection
        expect(tsConfig.compilerOptions?.paths?.[packageName]).toEqual([
          project.srcPath("index.ts"),
        ]);
      });
    });
  });

  it("generates a separate test dir", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.testPath())).toBe(true);
  });

  it("generates a package.json file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path("package.json"))).toBe(true);
  });

  describe("package.json", () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      packageJson = readJson(tree, project.path("package.json"));
    });

    it("sets the correct name", () => {
      expect(packageJson.name).toBe(project.getImportPath());
    });

    it("sets the correct version", () => {
      expect(packageJson.version).toBe("0.0.1");
    });

    it("sets the LICENSE", () => {
      expect(packageJson.license).toBe("UNLICENSED");
    });

    it("sets the repository section", () => {
      expect(packageJson.repository).toEqual({
        type: "git",
        url: `git+ssh://git@github.com/${projectScope}/${repoName}.git`,
        directory: project.path(),
      });
    });

    it("sets the bugs section", () => {
      expect(packageJson.bugs).toEqual({
        url: `https://github.com/${projectScope}/${repoName}/issues`,
      });
    });

    it("sets the homepage", () => {
      expect(packageJson.homepage).toEqual(
        `https://github.com/${projectScope}/${repoName}/blob/master/${project.path(
          "README.md",
        )}`,
      );
    });
  });

  projectJsonTestCases(getProject);
  jestProjectTestCases(getProject);
  tsconfigTestCases(getProject);
  eslintProjectTestCases(getProject);
  readmeProjectTestCases(getProject, options.repoName);
};
