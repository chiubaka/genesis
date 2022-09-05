import { Tree } from "@nrwl/devkit";

import { compatiblePackageVersions, Project } from "../../../src";

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

  it("generates a jest config", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(jestConfigPath)).toBe(true);
  });

  describe("jest.config.ts", () => {
    it("matches snapshot", () => {
      const contents = tree.read(jestConfigPath)?.toString();

      expect(contents).toMatchSnapshot();
    });
  });
};
