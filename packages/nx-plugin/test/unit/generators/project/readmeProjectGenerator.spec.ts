import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { libraryGenerator } from "@nrwl/node";

import { readmeProjectGenerator } from "../../../../src/generators";
import { Project } from "../../../utils";

describe("readmeProjectGenerator", () => {
  let tree: Tree;
  let project: Project;

  beforeAll(async () => {
    const projectName = "readme-project";
    const projectType = "library";

    tree = createTreeWithEmptyWorkspace();
    await libraryGenerator(tree, {
      name: projectName,
      compiler: "tsc",
    });
    tree.write(
      "README.md",
      "[![codecov](https://codecov.io/gh/proj/readme-project/branch/master/graph/badge.svg?token=foobar)](https://codecov.io/gh/proj/readme-project)",
    );
    readmeProjectGenerator(tree, {
      projectName,
      projectType,
      rootProjectGeneratorName: "project.readme",
    });

    project = new Project(tree, projectName, projectType);
  });

  it("generates a README file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path("README.md"))).toBe(true);
  });

  describe("README.md", () => {
    it("includes the project name as the title", () => {
      expect(tree).toHaveFileWithContent(
        project.path("README.md"),
        "# readme-project",
      );
    });

    describe("shields", () => {
      it("generates an NPM package version shield", () => {
        expect(tree).toHaveFileWithContent(
          project.path("README.md"),
          `[![npm](https://img.shields.io/npm/v/@proj/readme-project)](https://www.npmjs.com/package/@proj/readme-project)`,
        );
      });

      it("generates a Codecov shield for just the flag matching this project", () => {
        expect(tree).toHaveFileWithContent(
          project.path("README.md"),
          `[![codecov](https://codecov.io/gh/proj/readme-project/branch/master/graph/badge.svg?token=foobar&flag=readme-project)](https://codecov.io/gh/proj/readme-project)`,
        );
      });
    });
  });
});
