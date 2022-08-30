import { ProjectsConfigurations, readJson, Tree } from "@nrwl/devkit";

import { Project } from "../../../src";
import { TsConfig } from "../../types/tsconfig";

/**
 * Configures common test cases that should be included for all project generators
 * @param projectName name of the project being tested
 */
export const projectTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;
  let projectScope: string;
  let projectName: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();

    projectScope = project.getScope();
    projectName = project.getName();
  });

  it("generates a directory for the new project", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path())).toBe(true);
  });

  describe("workspace configurations", () => {
    describe("workspace.json", () => {
      it("updates projects to include a path to the newly generated project", () => {
        const workspaceJson = readJson<ProjectsConfigurations>(
          tree,
          "workspace.json",
        );

        // eslint-disable-next-line security/detect-object-injection
        expect(workspaceJson.projects[projectName]).toBe(project.path());
      });
    });

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
};
