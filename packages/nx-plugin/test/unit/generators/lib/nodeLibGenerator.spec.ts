import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { readJson, Tree } from "@nrwl/devkit";
import { PackageJson } from "nx/src/utils/package-json";

import { nodeLibGenerator, Project } from "../../../../src";
import { nodeProjectTestCases } from "../../../cases";

describe("nodeLibGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  const getProject = () => {
    return project;
  };
  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-lib", "library");
    e2eProject = new Project(tree, "node-lib-e2e", "e2e");

    const projectScope = project.getScope();
    const projectName = project.getName();

    tree.write(
      "README.md",
      `[![codecov](https://codecov.io/gh/${projectScope}/${projectName}/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/${projectScope}/${projectName})`,
    );

    await nodeLibGenerator(tree, {
      name: "node-lib",
      publishable: true,
      skipE2e: false,
    });
  });

  nodeProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test"],
    },
  });

  it("generates a sample unit test file in pascal case", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.testPath("unit/hello.spec.ts"))).toBe(true);
  });

  it("generates a sample file in pascal case", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.srcPath("hello.ts"))).toBe(true);
  });

  describe("package.json", () => {
    let packageJson: PackageJson;

    beforeAll(() => {
      packageJson = readJson<PackageJson>(tree, project.path("package.json"));
    });

    describe("scripts", () => {
      it("generates a deploy script", () => {
        expect(packageJson.scripts?.deploy).toBeTruthy();
      });

      it("generates a deploy:ci script", () => {
        expect(packageJson.scripts?.["deploy:ci"]).toBeTruthy();
      });
    });
  });

  describe("E2E project", () => {
    nodeProjectTestCases(getE2eProject, {
      projectJson: {
        targetNames: ["lint", "build", "e2e", "serve"],
      },
    });

    it("generates a main file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.srcPath("main.ts"))).toBe(true);
    });

    it("generates a file that enhances exported members of the lib", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.srcPath("helloExtended.ts"))).toBe(true);
    });
  });
});
