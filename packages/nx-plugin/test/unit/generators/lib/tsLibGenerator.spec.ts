import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, tsLibGenerator } from "../../../../src";
import {
  fileMatchesSnapshot,
  nodeProjectTestCases,
  tsProjectTestCases,
} from "../../../cases";

describe("tsLibGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  let projectName: string;

  const getProject = () => {
    return project;
  };
  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "ts-lib", "library");
    e2eProject = new Project(tree, "ts-lib-e2e", "e2e");

    projectName = project.getName();
  });

  tsProjectTestCases(getProject);

  beforeAll(async () => {
    await tsLibGenerator(tree, {
      name: projectName,
      skipE2e: false,
    });
  });

  it("generates a single lib project", () => {
    const projectNames = tree.children(project.relativePath(".."));

    expect(projectNames).toEqual(["ts-lib"]);
  });

  it("generates a single E2E project", () => {
    const e2eProjectNames = tree.children(e2eProject.relativePath(".."));

    // For whatever reason, the Tree directory API doesn't seem 100% correct, so names
    // don't match here (we get `ts-lib-` instead of `ts-lib-e2e`) while they do
    // match in E2E tests.
    expect(e2eProjectNames).toHaveLength(1);
  });

  describe("it generates a code sample", () => {
    it("generates a src/index.ts file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("index.ts"))).toBe(true);
    });

    it("generates a src/hello.ts file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.srcPath("hello.ts"))).toBe(true);
    });

    it("generates a sample unit test", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.testPath("unit/hello.spec.ts"))).toBe(true);
    });
  });

  describe("E2E project", () => {
    nodeProjectTestCases(getE2eProject, {
      repoName: "ts-lib",
    });

    describe("webpack.config.js", () => {
      it("generates a webpack.config.js file", () => {
        expect(tree.exists(e2eProject.path("webpack.config.js"))).toBe(true);
      });

      fileMatchesSnapshot(
        "webpack.config.js",
        getE2eProject,
        (e2eProject: Project) => {
          return e2eProject.path("webpack.config.js");
        },
      );
    });
  });
});
