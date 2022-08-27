import { Tree } from "@nrwl/devkit";

import { Project } from "../../../src";

export const jestProjectTestCases = (
  getProject: () => Project,
  expectedTestEnvironment?: string,
) => {
  let project: Project;
  let tree: Tree;

  let projectName: string;
  let jestConfigPath: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
    projectName = project.getName();
    jestConfigPath = project.jestConfigPath();
  });

  describe("jest.config.ts", () => {
    it("generates a jest config", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(jestConfigPath)).toBe(true);
    });

    it("does not have an eslint-disable directive", () => {
      expect(tree).not.toHaveFileWithContent(
        jestConfigPath,
        "/* eslint-disable */",
      );
    });

    if (expectedTestEnvironment) {
      it("sets the testEnvironment to node", () => {
        expect(tree).toHaveFileWithContent(
          jestConfigPath,
          `testEnvironment: "${expectedTestEnvironment}"`,
        );
      });
    }

    it("uses the project's kebab-case name as the displayName", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        `displayName: "${projectName}"`,
      );
    });

    it("inherits from the base workspace preset", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'preset: "../../jest.preset.js"',
      );
    });

    it("uses ts-jest to transform ts and js files", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        '"^.+\\\\.[tj]s$": "ts-jest"',
      );
    });

    it("allows ts, js, and html files as modules", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        'moduleFileExtensions: ["ts", "js", "html"]',
      );
    });

    it("outputs coverage reports to the base workspace reports directory", () => {
      expect(tree).toHaveFileWithContent(
        jestConfigPath,
        `coverageDirectory: "../../reports/coverage/packages/${projectName}"`,
      );
    });

    it("configures the jest-junit reporter for CircleCI test tab compatibility", () => {
      expect(tree).toHaveFileWithContent(jestConfigPath, "jest-junit");
    });
  });
};
