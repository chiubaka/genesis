import {
  ProjectConfiguration,
  readJson,
  TargetConfiguration,
  Tree,
} from "@nrwl/devkit";

import {
  EsLintExecutorOptions,
  JestExecutorOptions,
  LocalPublishExecutorSchema,
  Project,
} from "../../../src";

export interface ProjectJsonTestCasesOptions {
  targetNames: string[];
}

export const projectJsonTestCases = (
  getProject: () => Project,
  options: ProjectJsonTestCasesOptions,
) => {
  const { targetNames } = options;

  let project: Project;
  let tree: Tree;

  let projectJsonPath: string;

  beforeAll(() => {
    project = getProject();
    tree = project.getTree();

    projectJsonPath = project.path("project.json");
  });

  it("generates a project.json file", () => {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    expect(tree.exists(projectJsonPath)).toBe(true);
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson<ProjectConfiguration>(tree, projectJsonPath);
    });

    describe("targets", () => {
      let targets: Record<string, TargetConfiguration> | undefined;

      beforeAll(() => {
        targets = projectJson.targets;
      });

      for (const targetName of targetNames) {
        it(`includes a ${targetName} target`, () => {
          // eslint-disable-next-line security/detect-object-injection
          expect(targets?.[targetName]).toBeDefined();
        });
      }

      if (targetNames.includes("lint")) {
        describe("lint target", () => {
          let lintTarget: TargetConfiguration<EsLintExecutorOptions>;

          beforeAll(() => {
            lintTarget =
              targets?.lint as TargetConfiguration<EsLintExecutorOptions>;
          });

          it("runs tests using the eslint executor", () => {
            expect(lintTarget.executor).toEqual("@nrwl/linter:eslint");
          });

          it("lints all files in the project", () => {
            expect(lintTarget.options?.lintFilePatterns).toEqual([
              project.relativePath(),
            ]);
          });
        });
      }

      if (targetNames.includes("test")) {
        describe("test target", () => {
          let testTarget: TargetConfiguration<JestExecutorOptions>;

          beforeAll(() => {
            testTarget =
              targets?.test as TargetConfiguration<JestExecutorOptions>;
          });

          it("runs tests using the jest executor", () => {
            expect(testTarget.executor).toEqual("@nrwl/jest:jest");
          });

          it("specifies outputs", () => {
            expect(testTarget.outputs).toBeDefined();
            expect(testTarget.outputs?.length).toBeGreaterThan(0);
          });

          it("outputs coverage reports to the reports dir", () => {
            expect(
              testTarget.outputs?.includes(
                `reports/coverage/${project.relativePath()}`,
              ),
            ).toBe(true);
          });

          it("outputs junit test report files", () => {
            expect(
              testTarget.outputs?.includes(
                `reports/junit/${project.getName()}.xml`,
              ),
            ).toBe(true);
          });

          it("uses the jest config provided in the project", () => {
            expect(testTarget.options?.jestConfig).toEqual(
              project.relativePath("jest.config.ts"),
            );
          });
        });
      }

      if (targetNames.includes("local-publish")) {
        describe("local-publish target", () => {
          let localPublishTarget: TargetConfiguration<LocalPublishExecutorSchema>;

          beforeAll(() => {
            localPublishTarget = targets?.[
              "local-publish"
            ] as TargetConfiguration<LocalPublishExecutorSchema>;
          });

          it("uses the @chiubaka/nx-plugin:local-publish executor", () => {
            expect(localPublishTarget.executor).toEqual(
              "@chiubaka/nx-plugin:local-publish",
            );
          });

          it("depends on the self:build target", () => {
            expect(localPublishTarget.dependsOn).toEqual([
              {
                target: "build",
                projects: "self",
              },
            ]);
          });

          it("specifies the local registry", () => {
            expect(localPublishTarget.options?.registryUrl).toEqual(
              "http://localhost:4873",
            );
          });

          it("specifies the correct packagePath", () => {
            expect(localPublishTarget.options?.packagePath).toEqual(
              project.distPath(),
            );
          });
        });
      }
    });
  });
};
