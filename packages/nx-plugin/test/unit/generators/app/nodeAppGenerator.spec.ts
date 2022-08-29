import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import {
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nrwl/devkit";

import {
  nodeAppGenerator,
  Project,
  WebpackExecutorOptions,
} from "../../../../src";
import { nodeProjectTestCases } from "../../../cases";

describe("nodeAppGenerator", () => {
  let tree: Tree;
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-app", "application");

    const projectScope = project.getScope();
    const projectName = project.getName();

    tree.write(
      "README.md",
      `[![codecov](https://codecov.io/gh/${projectScope}/${projectName}/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/${projectScope}/${projectName})`,
    );

    await nodeAppGenerator(tree, {
      name: "node-app",
    });
  });

  nodeProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test", "serve"],
    },
  });

  it("generates a main.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("main.ts"))).toBe(true);
  });

  it("does not generate an index.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("index.ts"))).toBe(false);
  });

  it("generates a sample file that uses node APIs", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("hello.ts"))).toBe(true);
    expect(tree).toHaveFileWithContent(project.srcPath("hello.ts"), "node:");
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson<ProjectConfiguration>(
        tree,
        project.path("project.json"),
      );
    });

    describe("build target", () => {
      let buildTarget: TargetConfiguration<WebpackExecutorOptions>;
      let buildOptions: WebpackExecutorOptions | undefined;

      beforeAll(() => {
        buildTarget = projectJson.targets
          ?.build as TargetConfiguration<WebpackExecutorOptions>;
        buildOptions = buildTarget.options;
      });

      it("uses the webpack executor", () => {
        expect(buildTarget.executor).toBe("@nrwl/node:webpack");
      });

      it("specifies the correct output path", () => {
        expect(buildOptions?.outputPath).toEqual(project.distPath());
      });

      it("specifies the correct main script", () => {
        expect(buildOptions?.main).toEqual(project.relativePath("src/main.ts"));
      });

      it("specifies the correct tsConfig", () => {
        expect(buildOptions?.tsConfig).toEqual(
          project.relativePath("tsconfig.app.json"),
        );
      });

      it("specifies the correct assets directory", () => {
        expect(buildOptions?.assets).toEqual([
          project.relativePath("src/assets"),
        ]);
      });
    });
  });
});
