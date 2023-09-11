import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nx/devkit";

import { nodeAppGenerator, Project } from "../../../../src";
import { fileMatchesSnapshot, nodeProjectTestCases } from "../../../cases";

describe("nodeAppGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-app", "application");
    e2eProject = new Project(tree, "node-app-e2e", "e2e");
  });

  nodeProjectTestCases(getProject);

  beforeAll(async () => {
    await nodeAppGenerator(tree, {
      name: "node-app",
    });
  });

  it("generates a single app project", () => {
    const projectNames = tree.children(project.relativePath(".."));

    expect(projectNames).toEqual(["node-app"]);
  });

  // TODO: Node app generator doesn't yet implement E2E tests
  // eslint-disable-next-line jest/no-disabled-tests
  it.skip("generates a single E2E project", () => {
    const e2eProjectNames = tree.children(e2eProject.relativePath(".."));

    // For whatever reason, the Tree directory API doesn't seem 100% correct, so names
    // don't match here (we get `node-app-` instead of `node-app-e2e`) while they do
    // match in E2E tests.
    expect(e2eProjectNames).toHaveLength(1);
  });

  it("generates a main.ts file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("main.ts"))).toBe(true);
  });

  it("generates an assets dir", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("assets"))).toBe(true);
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

  describe("webpack.config.js", () => {
    it("generates a webpack.config.js file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(project.path("webpack.config.js"))).toBe(true);
    });

    fileMatchesSnapshot("webpack.config.js", getProject, (project: Project) => {
      return project.path("webpack.config.js");
    });
  });
});
