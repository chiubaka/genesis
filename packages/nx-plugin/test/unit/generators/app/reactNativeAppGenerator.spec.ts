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
      appName: "React Native App",
      appId: "com.chiubaka.ReactNativeApp",
      appleId: "example@chiubaka.com",
    });
  });

  describe("README", () => {
    it("adds first-time setup instructions for Android SDK", () => {
      expect(tree).toHaveFileWithContent(
        project.path("README.md"),
        "Android SDK",
      );
    });

    it("adds first-time setup instructions for iOS and XCode SDK", () => {
      expect(tree).toHaveFileWithContent(project.path("README.md"), "iOS SDK");
    });

    it("adds first-time setup instructions for emulators and Detox configuration", () => {
      expect(tree).toHaveFileWithContent(
        project.path("README.md"),
        ".detoxrc.json",
      );
    });

    it("adds first-time setup instructions for ruby", () => {
      expect(tree).toHaveFileWithContent(project.path("README.md"), "ruby");
    });

    // Unless I can accomplish this with the Podfile automatically
    // Should include info about Fastlane and getting Fastlane to generate certificates and profiles for you
    it.todo("adds first-time setup instructions for iOS code signing");

    // Google Play first-time setup: https://docs.fastlane.tools/actions/supply/
    it.todo("adds first-time setup instructions for Fastlane");
  });

  describe("project.json", () => {
    let projectJson: ProjectConfiguration;

    beforeAll(() => {
      projectJson = readJson(tree, project.path("project.json"));
    });

    it("renames bundle-android to bundle:android", () => {
      expect(projectJson.targets?.["bundle-android"]).toBeUndefined();
      expect(projectJson.targets?.["bundle:android"]).toBeDefined();
    });

    it("renames build-android to build:android", () => {
      expect(projectJson.targets?.["build-android"]).toBeUndefined();
      expect(projectJson.targets?.["build:android"]).toBeDefined();
    });

    it("renames run-android to run:android", () => {
      expect(projectJson.targets?.["run-android"]).toBeUndefined();
      expect(projectJson.targets?.["run:android"]).toBeDefined();
    });

    it("renames bundle-ios to bundle:ios", () => {
      expect(projectJson.targets?.["bundle-ios"]).toBeUndefined();
      expect(projectJson.targets?.["bundle:ios"]).toBeDefined();
    });

    it("renames build-ios to build:ios", () => {
      expect(projectJson.targets?.["build-ios"]).toBeUndefined();
      expect(projectJson.targets?.["build:ios"]).toBeDefined();
    });

    it("renames run-ios to run:ios", () => {
      expect(projectJson.targets?.["run-ios"]).toBeUndefined();
      expect(projectJson.targets?.["run:ios"]).toBeDefined();
    });

    it("leaves the @nx/react-native:build-android executor intact", () => {
      expect(tree).toHaveFileWithContent(
        project.path("project.json"),
        "@nx/react-native:build-android",
      );
    });

    it("creates a test:native:android target", () => {
      expect(projectJson.targets?.["test:native:android"]).toBeDefined();
    });

    it("creates a test:native:ios target", () => {
      expect(projectJson.targets?.["test:native:ios"]).toBeDefined();
    });

    it("adds sync-deps as a dependency of bundle:android", () => {
      const bundleAndroidTarget = projectJson.targets?.[
        "bundle:android"
      ] as TargetConfiguration<any>;

      expect(bundleAndroidTarget).toBeDefined();

      const dependsOn = bundleAndroidTarget.dependsOn as string[];

      expect(dependsOn).toBeDefined();

      expect(dependsOn).toContain("sync-deps");
    });

    it("adds sync-deps as a dependency of bundle:ios", () => {
      const bundleIosTarget = projectJson.targets?.[
        "bundle:ios"
      ] as TargetConfiguration<any>;

      expect(bundleIosTarget).toBeDefined();

      const dependsOn = bundleIosTarget.dependsOn as string[];

      expect(dependsOn).toBeDefined();

      expect(dependsOn).toContain("sync-deps");
    });
  });

  fileMatchesSnapshot(".ruby-version", getProject, (project: Project) => {
    return project.path(".ruby-version");
  });

  fileMatchesSnapshot(".xcode-version", getProject, (project: Project) => {
    return project.path(".xcode-version");
  });

  describe("Gemfile", () => {
    fileMatchesSnapshot("Gemfile", getProject, (project: Project) => {
      return project.path("Gemfile");
    });

    it("updates the required ruby version", () => {
      expect(tree).toHaveFileWithContent(
        project.path("Gemfile"),
        'ruby ">= 3.2.2"',
      );
    });

    it("replaces single quotes with double quotes", () => {
      expect(tree).not.toHaveFileWithContent(project.path("Gemfile"), "'");
    });
  });

  describe("native projects", () => {
    describe("fastlane", () => {
      it("adds fastlane to the Gemfile", () => {
        expect(tree).toHaveFileWithContent(
          project.path("Gemfile"),
          'gem "fastlane"',
        );
      });

      it("adds fastlane plugins to the Gemfile", () => {
        expect(tree).toHaveFileWithContent(
          project.path("Gemfile"),
          "Pluginfile",
        );
      });

      describe("Fastfile", () => {
        fileMatchesSnapshot("Fastfile", getProject, (project: Project) => {
          return project.path("fastlane/Fastfile");
        });

        it("fills in a value for APP_NAME", () => {
          expect(tree).toHaveFileWithContent(
            project.path("fastlane/Fastfile"),
            'APP_NAME = "ReactNativeApp',
          );
        });
      });

      describe("Appfile", () => {
        fileMatchesSnapshot("Appfile", getProject, (project: Project) => {
          return project.path("fastlane/Appfile");
        });

        it("fills in a value for app_identifier", () => {
          expect(tree).toHaveFileWithContent(
            project.path("fastlane/Appfile"),
            'app_identifier("com.chiubaka.ReactNativeApp")',
          );
        });

        it("fills in a value for apple_id", () => {
          expect(tree).toHaveFileWithContent(
            project.path("fastlane/Appfile"),
            'apple_id("example@chiubaka.com")',
          );
        });

        it.todo("fills in a value for itc_team_id");

        it.todo("fills in a value for team_id");

        it.todo("fills in a value for json_key_file");

        it("fills in a value for package_name", () => {
          expect(tree).toHaveFileWithContent(
            project.path("fastlane/Appfile"),
            'package_name("com.chiubaka.ReactNativeApp")',
          );
        });
      });
    });

    describe("ios", () => {
      let iosXcodeProjectPath: string;

      fileMatchesSnapshot(
        "ReactNativeApp/Info.plist",
        getProject,
        (project: Project) => {
          return project.path("ios/ReactNativeApp/Info.plist");
        },
      );

      beforeAll(() => {
        iosXcodeProjectPath = project.path(
          "ios/ReactNativeApp.xcodeproj/project.pbxproj",
        );
      });

      it("updates the bundle identifier", () => {
        expect(tree).not.toHaveFileWithContent(
          iosXcodeProjectPath,
          "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)",
        );

        expect(tree).toHaveFileWithContent(
          iosXcodeProjectPath,
          "com.chiubaka.ReactNativeApp",
        );
      });

      describe("app icon", () => {
        it("adds CFBundleIconName to Info.plist", () => {
          expect(tree).toHaveFileWithContent(
            project.path("ios/ReactNativeApp/Info.plist"),
            "\t<key>CFBundleIconName</key>\n\t<string>AppIcon</string>",
          );
        });

        it("adds a placeholder app icon", () => {
          expect(tree).toHaveFileWithContent(
            project.path(
              "ios/ReactNativeApp/Images.xcassets/AppIcon.appiconset/Contents.json",
            ),
            '"filename":',
          );
        });
      });

      // Aspirational! But not possible to actually accomplish unless I add stronger
      // capabilities to understand and modify the generated .pbxproj file
      // https://linear.app/chiubaka/issue/CT-723/update-the-development-team-in-the-generated-ios-pbxproj-file
      it.skip("updates the development team ID", () => {
        expect(tree).toHaveFileWithContent(
          iosXcodeProjectPath,
          'DEVELOPMENT_TEAM = "ABC1234567"',
        );
      });

      it("patches the Start Packager build phase to provide the correct PROJECT_ROOT", () => {
        expect(tree).toHaveFileWithContent(
          iosXcodeProjectPath,
          "export PROJECT_ROOT=${SRCROOT}",
        );
      });

      describe("Podfile", () => {
        fileMatchesSnapshot("Podfile", getProject, (project: Project) => {
          return project.path("ios/Podfile");
        });

        it("replaces single quotes with double quotes", () => {
          expect(tree).not.toHaveFileWithContent(
            project.path("ios/Podfile"),
            "target 'ReactNativeApp' do",
          );
        });
      });
    });

    describe("android", () => {
      describe("build.gradle", () => {
        it("updates the namespace", () => {
          expect(tree).not.toHaveFileWithContent(
            project.path("android/app/build.gradle"),
            'namespace "com.reactnativeapp"',
          );

          expect(tree).toHaveFileWithContent(
            project.path("android/app/build.gradle"),
            'namespace "com.chiubaka.reactnativeapp"',
          );
        });

        it("updates the applicationId", () => {
          expect(tree).not.toHaveFileWithContent(
            project.path("android/app/build.gradle"),
            'applicationId "com.reactnativeapp"',
          );

          expect(tree).toHaveFileWithContent(
            project.path("android/app/build.gradle"),
            'applicationId "com.chiubaka.ReactNativeApp"',
          );
        });
      });

      describe("java files", () => {
        describe("moves java source files to appropriate new package directories", () => {
          it("androidTest", () => {
            expect(tree).toHaveRenamedFile(
              project.path(
                "android/app/src/androidTest/java/com/reactnativeapp",
              ),
              project.path(
                "android/app/src/androidTest/java/com/chiubaka/reactnativeapp",
              ),
            );
          });

          it("debug", () => {
            expect(tree).toHaveRenamedFile(
              project.path("android/app/src/debug/java/com/reactnativeapp"),
              project.path(
                "android/app/src/debug/java/com/chiubaka/reactnativeapp",
              ),
            );
          });

          it("main", () => {
            expect(tree).toHaveRenamedFile(
              project.path("android/app/src/main/java/com/reactnativeapp"),
              project.path(
                "android/app/src/main/java/com/chiubaka/reactnativeapp",
              ),
            );
          });

          it("release", () => {
            expect(tree).toHaveRenamedFile(
              project.path("android/app/src/release/java/com/reactnativeapp"),
              project.path(
                "android/app/src/release/java/com/chiubaka/reactnativeapp",
              ),
            );
          });
        });

        describe("updates the package for moved java source files", () => {
          it("DetoxTest.java", () => {
            const detoxTestPath = project.path(
              "android/app/src/androidTest/java/com/chiubaka/reactnativeapp/DetoxTest.java",
            );

            expect(tree).not.toHaveFileWithContent(
              detoxTestPath,
              "package com.reactnativeapp",
            );

            expect(tree).toHaveFileWithContent(
              detoxTestPath,
              "package com.chiubaka.reactnativeapp",
            );
          });

          it("debug ReactNativeFlipper.java", () => {
            const reactNativeFlipperPath = project.path(
              "android/app/src/debug/java/com/chiubaka/reactnativeapp/ReactNativeFlipper.java",
            );

            expect(tree).not.toHaveFileWithContent(
              reactNativeFlipperPath,
              "package com.reactnativeapp",
            );

            expect(tree).toHaveFileWithContent(
              reactNativeFlipperPath,
              "package com.chiubaka.reactnativeapp",
            );
          });

          it("release ReactNativeFlipper.java", () => {
            const reactNativeFlipperPath = project.path(
              "android/app/src/release/java/com/chiubaka/reactnativeapp/ReactNativeFlipper.java",
            );

            expect(tree).not.toHaveFileWithContent(
              reactNativeFlipperPath,
              "package com.reactnativeapp",
            );

            expect(tree).toHaveFileWithContent(
              reactNativeFlipperPath,
              "package com.chiubaka.reactnativeapp",
            );
          });

          it("MainActivity.java", () => {
            const mainActivityPath = project.path(
              "android/app/src/main/java/com/chiubaka/reactnativeapp/MainActivity.java",
            );

            expect(tree).not.toHaveFileWithContent(
              mainActivityPath,
              "package com.reactnativeapp",
            );

            expect(tree).toHaveFileWithContent(
              mainActivityPath,
              "package com.chiubaka.reactnativeapp",
            );
          });

          it("MainApplication.java", () => {
            const mainApplicationPath = project.path(
              "android/app/src/main/java/com/chiubaka/reactnativeapp/MainApplication.java",
            );

            expect(tree).not.toHaveFileWithContent(
              mainApplicationPath,
              "package com.reactnativeapp",
            );

            expect(tree).toHaveFileWithContent(
              mainApplicationPath,
              "package com.chiubaka.reactnativeapp",
            );
          });
        });
      });
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

    describe("project.json", () => {
      let projectJson: ProjectConfiguration;

      beforeAll(() => {
        projectJson = readJson(tree, e2eProject.path("project.json"));
      });

      fileMatchesSnapshot(
        "project.json",
        getE2eProject,
        (e2eProject: Project) => {
          return e2eProject.path("project.json");
        },
      );

      it("renames build-ios to build:ios", () => {
        expect(projectJson.targets?.["build-ios"]).toBeUndefined();
        expect(projectJson.targets?.["build:ios"]).toBeDefined();
      });

      it("renames build-android to build:android", () => {
        expect(projectJson.targets?.["build-android"]).toBeUndefined();
        expect(projectJson.targets?.["build:android"]).toBeDefined();
      });

      it("renames test-ios to e2e:ios", () => {
        expect(projectJson.targets?.["test-ios"]).toBeUndefined();
        expect(projectJson.targets?.["e2e:ios"]).toBeDefined();
      });

      it("renames test-android to e2e:android", () => {
        expect(projectJson.targets?.["test-android"]).toBeUndefined();
        expect(projectJson.targets?.["e2e:android"]).toBeDefined();
      });
    });

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

    describe("jest.config.json", () => {
      fileMatchesSnapshot(
        "jest.config.json",
        getE2eProject,
        (e2eProject: Project) => {
          return e2eProject.path("jest.config.json");
        },
      );

      it("changes the coverage directory to monorepo root", () => {
        const jestConfig = readJson<jest.Config>(
          tree,
          e2eProject.path("jest.config.json"),
        );

        expect(jestConfig.coverageDirectory).toBe(
          `../../reports/coverage/${e2eProject.relativePath()}`,
        );
      });

      it("sets up the jest-junit reporter", () => {
        expect(tree).toHaveFileWithContent(
          e2eProject.path("jest.config.json"),
          "jest-junit",
        );
      });
    });
  });
});
