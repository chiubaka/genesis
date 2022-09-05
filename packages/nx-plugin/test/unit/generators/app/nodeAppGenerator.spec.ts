import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { nodeAppGenerator, Project } from "../../../../src";
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
  });

  nodeProjectTestCases(getProject);

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
});
