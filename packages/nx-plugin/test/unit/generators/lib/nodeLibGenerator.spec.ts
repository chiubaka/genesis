import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import { ProjectConfiguration, readJson, Tree } from "@nrwl/devkit";
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
      skipE2e: false,
    });
  });

  nodeProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test", "local-publish"],
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
        targetNames: ["lint", "build", "e2e"],
      },
      repoName: "node-lib",
    });

    it("generates a main file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.srcPath("main.ts"))).toBe(true);
    });

    it("generates a file that enhances exported members of the lib", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.srcPath("helloExtended.ts"))).toBe(true);
    });

    it("generates a yarn.lock file to keep this project separate from the parent workspace", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.path("yarn.lock"))).toBe(true);
    });

    it("generates a .yarnrc.yml file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.path(".yarnrc.yml"))).toBe(true);
    });

    describe(".yarnrc.yml", () => {
      it("uses the node-modules nodeLinker", () => {
        expect(tree).toHaveFileWithContent(
          ".yarnrc.yml",
          "nodeLinker: node-modules",
        );
      });

      it("uses the local registry to install packages", () => {
        expect(tree).toHaveFileWithContent(
          ".yarnrc.yml",
          'npmRegistryServer: "http://localhost:4873"',
        );
      });

      it("whitelists localhost for http", () => {
        expect(tree).toHaveFileWithContent(
          ".yarnrc.yml",
          'unsafeHttpWhitelist: ["localhost"]',
        );
      });
    });

    describe("package.json", () => {
      it("installs the library from the dist directory", () => {
        expect(tree).toHaveDependency(
          `@${project.getScope()}/${project.getName()}`,
          `file:dist/packages/node-lib`,
          e2eProject.path("package.json"),
        );
      });
    });

    describe("project.json", () => {
      describe("e2e target", () => {
        it("depends on the library's build job", () => {
          const projectJson = readJson<ProjectConfiguration>(
            tree,
            e2eProject.path("project.json"),
          );

          expect(projectJson.implicitDependencies).toContain("node-lib");
          expect(projectJson.targets?.e2e.dependsOn).toContainEqual({
            target: "local-publish",
            projects: "dependencies",
          });
        });
      });
    });
  });

  describe("workspace", () => {
    describe("package.json", () => {
      it.todo("Adds a start:verdaccio script");
    });

    describe("README.md", () => {
      it.todo(
        "Updates the README with instructions about how to run E2E tests",
      );
    });

    describe("docker-compose", () => {
      it("generates a docker-compose.yml file for the workspace", () => {
        expect(tree.exists("docker-compose.yml")).toBe(true);
      });

      describe("verdaccio", () => {
        it("creates a verdaccio service", () => {
          // TODO: This assertion should use something that actually parses YAML
          // https://github.com/chiubaka/genesis/issues/111
          expect(tree).toHaveFileWithContent(
            "docker-compose.yml",
            "image: verdaccio/verdaccio",
          );
        });

        it.todo("runs verdaccio on port 4873");

        it("generates a basic verdaccio config", () => {
          expect(tree.exists("verdaccio/config.yaml")).toBe(true);
        });

        it.todo("uses the generated verdaccio config in the docker container");

        describe("config.yaml", () => {
          it.todo(
            "ensures that the access to the generated package is not proxied to NPM",
          );
        });
      });
    });
  });
});
