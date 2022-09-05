import { readJson, Tree } from "@nrwl/devkit";

import { Project } from "../../../src";
import { TsConfig } from "../../types/tsconfig";
import { projectTestCases, ProjectTestCasesOptions } from "./projectTestCases";

export const reactProjectTestCases = (
  getProject: () => Project,
  options: ProjectTestCasesOptions,
) => {
  let project: Project;
  let tree: Tree;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();
  });

  it("generates a .babelrc file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path(".babelrc"))).toBe(true);
  });

  describe(".babelrc", () => {
    it("matches snapshot", () => {
      const babelrc = readJson<Record<string, unknown>>(
        tree,
        project.path(".babelrc"),
      );

      expect(babelrc).toMatchSnapshot();
    });
  });

  describe("storybook", () => {
    it("generates a .storybook/tsconfig.json file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".storybook/tsconfig.json")));
    });

    describe(".storybook/tsconfig.json", () => {
      let tsConfig: TsConfig;

      beforeAll(() => {
        tsConfig = readJson(tree, project.path(".storybook/tsconfig.json"));
      });

      it("matches snapshot", () => {
        expect(tsConfig).toMatchSnapshot();
      });
    });

    it("generates a .storybook/main.ts file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".storybook/main.ts")));
    });

    describe(".storybook/main.ts", () => {
      it("matches snapshot", () => {
        const contents = tree
          .read(project.path(".storybook/main.ts"))
          ?.toString();

        expect(contents).toMatchSnapshot();
      });
    });

    it("generates a .storybook/preview.ts file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path(".storybook/preview.ts")));
    });

    describe(".storybook/preview.ts", () => {
      it("matches snapshot", () => {
        const contents = tree
          .read(project.path(".storybook/preview.ts"))
          ?.toString();

        expect(contents).toMatchSnapshot();
      });
    });
  });

  projectTestCases(getProject, {
    ...options,
    jest: {
      testEnvironment: "jsdom",
    },
  });
};
