import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { Tree } from "@nrwl/devkit";

import { Project, tsLibGenerator } from "../../../../src";
import {
  libTestCases,
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

  libTestCases(getProject);
  tsProjectTestCases(getProject);

  beforeAll(async () => {
    await tsLibGenerator(tree, {
      name: projectName,
      skipE2e: false,
    });
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
  });
});
