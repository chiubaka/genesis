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

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-app", "application");

    const projectScope = project.getScope();
    const projectName = project.getName();

    tree.write(
      "README.md",
      `[![codecov](https://codecov.io/gh/${projectScope}/${projectName}/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/${projectScope}/${projectName})`,
    );
  });

  nodeProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test", "serve"],
    },
  });

  beforeAll(async () => {
    await nodeAppGenerator(tree, {
      name: "node-app",
    });
  });

  it("generates a main.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("main.ts"))).toBe(true);
  });

  it("generates an assets dir", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("assets"))).toBe(true);
  });

  it("generates an environments dir with environment options", () => {
    /* eslint-disable security/detect-non-literal-fs-filename */
    expect(tree.exists(project.srcPath("environments"))).toBe(true);
    expect(
      tree.exists(project.srcPath("environments/environment.prod.ts")),
    ).toBe(true);
    expect(tree.exists(project.srcPath("environments/environment.ts"))).toBe(
      true,
    );
    /* eslint-enable security/detect-non-literal-fs-filename */
  });

  it("generates a sample file that uses node APIs", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("hello.ts"))).toBe(true);
    expect(tree).toHaveFileWithContent(project.srcPath("hello.ts"), "node:");
  });

  it("does not generate an index.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("index.ts"))).toBe(false);
  });

  it("does not generate an app dir", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("app"))).toBe(false);
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
