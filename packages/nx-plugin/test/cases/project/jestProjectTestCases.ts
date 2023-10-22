import { Tree } from "@nx/devkit";

import { compatiblePackageVersions, Project } from "../../../src";
import { fileMatchesSnapshot } from "..";

export const jestProjectTestCases = (getProject: () => Project) => {
  let project: Project;
  let tree: Tree;

  let jestConfigPath: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
    jestConfigPath = project.jestConfigPath();
  });

  describe("package.json", () => {
    describe("devDependencies", () => {
      it("lists jest", () => {
        expect(tree).toHaveDevDependency(
          "jest",
          compatiblePackageVersions["jest"],
          project.path("package.json"),
        );
      });

      it("lists jest-junit", () => {
        expect(tree).toHaveDevDependency(
          "jest-junit",
          undefined,
          project.path("package.json"),
        );
      });
    });
  });

  describe("jest.config.ts", () => {
    fileMatchesSnapshot("jest.config.ts", getProject, () => {
      return jestConfigPath;
    });
  });
};
