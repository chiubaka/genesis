/* eslint-disable security/detect-non-literal-fs-filename */

import {
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { PackageJson } from "nx/src/utils/package-json";

import { nodeLibGenerator } from "../../../../src/generators";
import { Project } from "../../../../src/utils";
import { nodeProjectTestCases } from "../../../cases";

describe("nodeLibGenerator", () => {
  let tree: Tree;
  let project: Project;

  const getProject = () => {
    return project;
  };

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-lib", "library");

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

  nodeProjectTestCases(getProject);

  it("generates a sample unit test file in pascal case", () => {
    expect(tree.exists(project.testPath("unit/hello.spec.ts"))).toBe(true);
  });

  it("generates a sample file in pascal case", () => {
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

  it("generates a project.json file", () => {
    expect(tree.exists(project.path("project.json"))).toBe(true);
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson<ProjectConfiguration>(
        tree,
        project.path("project.json"),
      );
    });

    describe("targets", () => {
      let targets: Record<string, TargetConfiguration> | undefined;

      beforeAll(() => {
        targets = projectJson.targets;
      });

      it("includes a lint target", () => {
        expect(targets?.lint).toBeDefined();
      });

      it("includes a test target", () => {
        expect(targets?.test).toBeDefined();
      });

      it("includes a build target", () => {
        expect(targets?.build).toBeDefined();
      });
    });
  });
});
/* eslint-enable security/detect-non-literal-fs-filename */
