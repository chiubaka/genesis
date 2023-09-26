import { createTreeWithEmptyWorkspace } from "@chiubaka/nx-plugin-testing";
import {
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nx/devkit";

import {
  EsLintExecutorOptions,
  PackageJson,
  Project,
  reactNativeAppGenerator,
} from "../../../../src";
import { fileMatchesSnapshot } from "../../../cases";
import { projectTestCases } from "../../../cases/project/projectTestCases";

describe("reactNativeAppGenerator", () => {
  let tree: Tree;
  let project: Project;
  let e2eProject: Project;

  const getProject = () => {
    return project;
  };

  const getE2eProject = () => {
    return e2eProject;
  };

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    project = new Project(tree, "react-native-app", "application");
    e2eProject = new Project(tree, "react-native-app-e2e", "e2e");
  });

  projectTestCases(getProject);

  it("removes the React Native app from yarn workspaces", () => {
    const packageJson = readJson<PackageJson>(tree, "package.json");

    const workspaces = (packageJson.workspaces ?? { packages: [] }) as {
      packages: string[];
    };

    const packages = workspaces.packages;

    expect(packages).toContain(`!${project.path()}`);
  });

  it("moves the test-setup.ts file to test/setup/setup.ts", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.path("test-setup.ts"))).toBe(false);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(project.testPath("setup/setup.ts"))).toBe(true);
  });

  beforeAll(async () => {
    await reactNativeAppGenerator(tree, {
      name: "react-native-app",
      displayName: "React Native App",
    });
  });

  describe("e2e", () => {
    it("generates an e2e project in the right place", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.path())).toBe(true);
    });

    projectTestCases(getE2eProject, {
      skipPackageJson: true,
      skipReadme: true,
      skipTsConfig: true,
      skipJest: true,
    });

    fileMatchesSnapshot(
      ".detoxrc.json",
      getE2eProject,
      (e2eProject: Project) => {
        return e2eProject.path(".detoxrc.json");
      },
    );

    fileMatchesSnapshot(
      "project.json",
      getE2eProject,
      (e2eProject: Project) => {
        return e2eProject.path("project.json");
      },
    );

    describe("typescript", () => {
      describe("tsconfig.json", () => {
        fileMatchesSnapshot(
          "tsconfig.json",
          getE2eProject,
          (e2eProject: Project) => {
            return e2eProject.path("tsconfig.json");
          },
        );

        it("updates references in tsconfig.json to refer to tsconfig.spec.json", () => {
          expect(tree).toHaveFileWithContent(
            e2eProject.path("tsconfig.json"),
            "tsconfig.spec.json",
          );
        });
      });

      fileMatchesSnapshot(
        "tsconfig.spec.json",
        getE2eProject,
        (e2eProject: Project) => {
          return e2eProject.path("tsconfig.spec.json");
        },
      );

      it("does not generate a tsconfig.e2e.json file", () => {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        expect(tree.exists(e2eProject.path("tsconfig.e2e.json"))).toBe(false);
      });
    });

    it("updates references in the e2e project.json file", () => {
      const projectJson = readJson<ProjectConfiguration>(
        tree,
        e2eProject.path("project.json"),
      );

      const lintTarget = projectJson.targets
        ?.lint as TargetConfiguration<EsLintExecutorOptions>;

      const lintFilePatterns = lintTarget.options?.lintFilePatterns as string[];

      expect(lintFilePatterns).toHaveLength(1);

      expect(lintFilePatterns[0]).toContain(e2eProject.path());
    });

    it("generates a test directory instead of a src directory", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.srcPath())).toBe(false);
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.testPath())).toBe(true);
    });

    it("still generates a sample e2e test", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.testPath("e2e/app.spec.ts"))).toBe(true);
    });

    it("moves the test-setup.ts file to test/setup/setup.ts", () => {
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.path("test-setup.ts"))).toBe(false);
      // eslint-disable-next-line security/detect-non-literal-fs-filename
      expect(tree.exists(e2eProject.testPath("setup/setup.ts"))).toBe(true);
    });

    fileMatchesSnapshot(
      "jest.config.json",
      getE2eProject,
      (e2eProject: Project) => {
        return e2eProject.path("jest.config.json");
      },
    );
  });
});
