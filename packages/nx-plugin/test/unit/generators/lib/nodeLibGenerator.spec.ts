import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import {
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nrwl/devkit";
import { PackageJson } from "nx/src/utils/package-json";

import {
  nodeLibGenerator,
  Project,
  readYaml,
  RunCommandsOptions,
  YarnConfig,
} from "../../../../src";
import { nodeProjectTestCases } from "../../../cases";

describe("nodeLibGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  let projectScope: string;
  let projectName: string;
  let importPath: string;

  const getProject = () => {
    return project;
  };
  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "node-lib", "library");
    e2eProject = new Project(tree, "node-lib-e2e", "e2e");

    projectScope = project.getScope();
    projectName = project.getName();
    importPath = `@${projectScope}/${projectName}`;
  });

  nodeProjectTestCases(getProject, {
    projectJson: {
      targetNames: ["lint", "build", "test"],
    },
  });

  beforeAll(async () => {
    await nodeLibGenerator(tree, {
      name: projectName,
      skipE2e: false,
    });
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

    describe("package.json", () => {
      it("install the library project from the dist directory", () => {
        expect(tree).toHaveDependency(
          importPath,
          `file:../../${project.distPath()}`,
          e2eProject.path("package.json"),
        );
      });
    });

    it("generates a .yarnrc.yml file", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.path(".yarnrc.yml"))).toBe(true);
    });

    describe(".yarnrc.yml", () => {
      let yarnConfig: YarnConfig;

      beforeAll(() => {
        yarnConfig = readYaml<YarnConfig>(tree, e2eProject.path(".yarnrc.yml"));
      });

      it("uses the node-modules nodeLinker", () => {
        expect(yarnConfig.nodeLinker).toBe("node-modules");
      });

      it("uses the local registry to install packages", () => {
        expect(yarnConfig.npmRegistryServer).toBe("http://localhost:4873");
      });

      it("whitelists localhost for http", () => {
        expect(yarnConfig.unsafeHttpWhitelist).toEqual(["localhost"]);
      });
    });

    describe("project.json", () => {
      let projectJson: ProjectConfiguration;

      beforeAll(() => {
        projectJson = readJson<ProjectConfiguration>(
          tree,
          e2eProject.path("project.json"),
        );
      });

      it("lists the library project as an implicit dependency", () => {
        expect(projectJson.implicitDependencies).toContain("node-lib");
      });

      describe("install target", () => {
        let installTarget: TargetConfiguration<RunCommandsOptions>;

        beforeAll(() => {
          installTarget = projectJson.targets
            ?.install as TargetConfiguration<RunCommandsOptions>;
        });

        it("users the @nrwl/workspace:run-commands executor", () => {
          expect(installTarget.executor).toBe("@nrwl/workspace:run-commands");
        });

        it("runs commands in the e2e project", () => {
          expect(installTarget.options?.cwd).toBe(e2eProject.path());
        });

        it("first clears the global yarn cache", () => {
          expect(installTarget.options?.commands?.[0]).toBe(
            "yarn cache clean --all",
          );
        });

        it("then runs the yarn install command", () => {
          expect(installTarget.options?.commands?.[1]).toBe("yarn install");
        });

        it("depends on the library's build target", () => {
          expect(installTarget.dependsOn).toContainEqual({
            target: "build",
            projects: "dependencies",
          });
        });
      });

      describe("e2e target", () => {
        let e2eTarget: TargetConfiguration;

        beforeAll(() => {
          e2eTarget = projectJson.targets?.e2e as TargetConfiguration;
        });

        it("uses the jest executor", () => {
          expect(e2eTarget.executor).toBe("@nrwl/jest:jest");
        });

        it("depends on the install target", () => {
          expect(e2eTarget.dependsOn).toContainEqual({
            target: "install",
            projects: "self",
          });
        });
      });
    });
  });
});
