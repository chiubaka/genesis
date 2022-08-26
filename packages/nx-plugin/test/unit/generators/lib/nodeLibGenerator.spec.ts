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
import { nodeProjectTestCases } from "../../../cases";
import { Project } from "../../../utils";

describe("nodeLibGenerator", () => {
  const tree: Tree = createTreeWithEmptyWorkspace();
  const project: Project = new Project(tree, "node-lib", "library");

  beforeAll(async () => {
    tree.write(
      "README.md",
      "[![codecov](https://codecov.io/gh/chiubaka/node-lib/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/chiubaka/node-lib)",
    );

    await nodeLibGenerator(tree, {
      name: "node-lib",
      scope: "chiubaka",
      publishable: true,
      skipE2e: false,
    });
  });

  nodeProjectTestCases(project);

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

  it("generates a README.md file", () => {
    expect(tree.exists(project.path("README.md"))).toBe(true);
  });

  describe("README.md", () => {
    it("includes the project name as the title", () => {
      expect(tree).toHaveFileWithContent(
        project.path("README.md"),
        "# node-lib",
      );
    });

    describe("shields", () => {
      it("generates an NPM package version shield", () => {
        expect(tree).toHaveFileWithContent(
          project.path("README.md"),
          `[![npm](https://img.shields.io/npm/v/@chiubaka/node-lib)](https://www.npmjs.com/package/@chiubaka/node-lib)`,
        );
      });

      it("generates a Codecov shield for just the flag matching this project", () => {
        expect(tree).toHaveFileWithContent(
          project.path("README.md"),
          `[![codecov](https://codecov.io/gh/chiubaka/node-lib/branch/master/graph/badge.svg?token=foobar&flag=node-lib)](https://codecov.io/gh/chiubaka/node-lib)`,
        );
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
