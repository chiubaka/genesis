import {
  generateFiles,
  getPackageManagerCommand,
  moveFilesToNewDirectory,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  updateJson,
} from "@nx/devkit";
import endent from "endent";
import path from "node:path";

import { EsLintExecutorOptions, JestConfig, PackageJson } from "../../../types";
import {
  Project,
  ProjectJsonUtils,
  replaceInFile,
  spawn,
} from "../../../utils";
import {
  eslintProjectGenerator,
  fastlaneProjectGenerator,
  reactNativeProjectGenerator,
} from "../../project";
import { ReactNativeAppGeneratorSchema } from "./reactNativeAppGenerator.schema";

export async function reactNativeAppGenerator(
  tree: Tree,
  options: ReactNativeAppGeneratorSchema,
) {
  const { name, appName, skipCodeSigning } = options;
  const project = new Project(tree, name, "application");
  const e2eProject = new Project(tree, `${name}-e2e`, "e2e");

  let additionalSetupSteps = endent`
    - [] Install additional development dependencies for React Native
      - [] Ensure that you have the Android SDK installed
      - [] Ensure that you have Xcode, Xcode Command Line Tools, and the iOS SDKs installed
      - [] Ensure that you have \`ruby\` (required) and \`rbenv\` (optional but recommended)
    - [] Finish setting up E2E testing with Detox
      - [] Update \`.detoxrc.js\` file in the generated E2E project
        - Ensure that a valid \`avdName\` is filled in under the \`devices\` section OR create an Android
          Virtual Device in Android Studio using the default name "Detox"
  `;

  if (!skipCodeSigning) {
    additionalSetupSteps += endent`
      - [] Finish setting up iOS code signing and deployment via TestFlight
        - [] If you didn't supply a \`codeSigningGitRepositoryUrl\`, you'll need
             to manually fill in the \`git_url\` value in \`fastlane/Matchfile\`.
               - If you don't already have a repository, you may need to create new one
                 for use with Fastlane match. You can read more about this process
                 [here](https://docs.fastlane.tools/actions/match/).
        - [] Finish setting up iOS code signing and automated deployment with CircleCI
          - [] Add the \`MATCH_PASSWORD\` environment variable to CircleCI--this is your Fastlane match encryption password
          - [] Under the CircleCI project's SSH Keys, set the project up with a user key. It is recommended that
               you create a GitHub machine user account and invite it to access your code signing repository and
               your monorepo. Authorize CircleCI to connect to GitHub using this machine user account.
          - [] Create and download an App Store Connect API key.
            - [] Place your downloaded \`.p8\` key in the \`ios/secrets\` directory.
              - This file **SHOULD NOT** be checked into source control. However, you should back this file
                up somewhere safe so you don't list it. The \`ios/secrets\` directory is automatically
                ignored by \`git\`.
            - [] Add a \`APP_STORE_CONNECT_APP_KEY_ISSUER_ID\` variable to \`fastlane/Fastlane.env\`
              - You can find this value on the screen where you generated and downloaded your key
            - [] Add a \`APP_STORE_CONNECT_KEY_ID\` variable to \`fastlane/Fastlane.env\`
              - You can find this value on the screen where you generated and downloaded your key
            - Refer to [Fastlane's documentation](https://docs.fastlane.tools/getting-started/ios/authentication/#method-1-app-store-connect-api-key-recommended) on this for more info.
          - [] Add an \`APP_STORE_CONNECT_KEY\` environment variable to the CircleCI project with the base64 encoded contents of your \`p8\` key
            - \`base64 -i app-store-connect-key.p8\`
          - Consider creating a [context](https://circleci.com/docs/contexts/) for CircleCI environment variables.
            - This will allow you to share account-level environment variables with other projects in your org.
            - By default, the generated CI configs reference an \`ios-deployment\` context.
      - [] Finish setting up Android code signing and deployment via Google Play Store
        - [] Create a Google service account with permissions to the Google Play Android Developer API
             and download a \`.json\` private key for the account into this repository.
             repo to automate access to Google Play Store publishing
             - Refer to [Fastlane's documentation](https://docs.fastlane.tools/actions/supply/#setup) and to [Google's](https://developers.google.com/android-publisher/getting_started)
             - Place your generated \`.json\` service account private key file in this project as \`android/secrets/google-play-key.json\`
               - This file **SHOULD NOT** be checked into source control. However, you should back
                 this file up somewhere safe so you don't lose it. The \`android/secrets\` directory
                 is automatically ignored by \`git\`.
               - If you choose to place this file elsewhere, you must update the \`json_key_file\` value
                 in \`fastlane/Appfile\`
             - Make sure you've granted your Service Account permissions in Google Play [here](https://play.google.com/console/users-and-permissions)!! It is not sufficient to just create the service account in the Google Cloud Console.
        - [] Create a new app in the [Google Play Console](https://play.google.com/console/u/0/developers/?pli=1)
          - You must set up an Internal Test Track and manually upload at least one build before
            deployment automation with \`fastlane\` can do its magic
          - You can generate a \`.aab\` bundle to manually upload using the command \`yarn nx build:android ${project.getName()} --configuration=bundle-release\`
            - The bundle will be output to \`android/app/build/outputs/bundle/release/app-release.aab\`
            - The bundle will be signed using the generated \`android/secrets/upload-keystore.jks\`
        - [] Finish setting up Android code signing and automated deployment with CircleCI
          - [] Add the \`BASE64_KEYSTORE\`, \`GOOGLE_PLAY_KEY\`, \`RELEASE_KEY_ALIAS\`,
               \`RELEASE_KEY_PASSWORD\`, and \`RELEASE_STORE_PASSWORD\` to the CircleCI
               project's environment variables.
            - Refer to [CircleCI's documentation](https://circleci.com/docs/deploy-android-applications/)
            - The keystore details can be found in the generated \`android/secrets/upload-keystore.properties\` file
    `;
  }

  const reactNativeProjectTask = await reactNativeProjectGenerator(tree, {
    ...project.getMeta(),
    displayName: appName,
    rootProjectGeneratorName: "app.react-native",
    additionalSetupSteps,
  });

  copyTemplates(project, options);
  updateWorkspace(project);
  updateProjectJson(project);
  updateNativeProjects(project, options);
  updateCodeSample(project);

  const installPodsTask = installPods(project);

  const fastlaneTask = fastlaneProjectGenerator(tree, {
    ...project.getMeta(),
    ...options,
  });

  const originalE2eBaseDir = project.relativePath("..");
  updateE2eProject(e2eProject, project, originalE2eBaseDir, options);

  return async () => {
    await reactNativeProjectTask();
    await installPodsTask();
    await fastlaneTask();
  };
}

function copyTemplates(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = project.getTree();
  const templateDir = path.join(__dirname, "./files/project");

  generateFiles(tree, templateDir, project.path(), {
    rubyVersion: "3.2.2",
    xcodeVersion: "14.3.1",
    template: "",
    ...options,
  });
}

function updateWorkspace(project: Project) {
  revertGitIgnore(project);
  updatePackageJsonScripts(project);
  updateHuskyPrePushCommand(project);
  updateYarnWorkspaces(project);
}

/**
 * The base React Native app generator makes the workspace .gitignore file
 * very messy. We undo those changes in favor of just copying over a .gitignore
 * file for the project.
 * @param project the project we are currently generating
 */
function revertGitIgnore(project: Project) {
  const tree = project.getTree();

  const gitIgnoreContents = tree.read(".gitignore")?.toString();

  if (!gitIgnoreContents) {
    throw new Error(
      "Unexpectedly received null while reading workspacine .gitignore",
    );
  }

  const reactNativeIndex = gitIgnoreContents.indexOf("# React Native");

  tree.write(".gitignore", gitIgnoreContents.slice(0, reactNativeIndex));
}

function updatePackageJsonScripts(project: Project) {
  const tree = project.getTree();

  updateJson(tree, "package.json", (packageJson: PackageJson) => {
    const scripts = packageJson.scripts || {};

    addScriptsForTarget("build", scripts);
    addScriptsForTarget("test", scripts);
    addScriptsForTarget("e2e", scripts);

    scripts["test:js:ci"] = `${scripts["test:js:ci"]} --ci --coverage`;

    scripts[
      "e2e:ios:ci"
    ] = `${scripts["e2e:ios:ci"]} --ci --configuration=production`;
    scripts[
      "e2e:android:ci"
    ] = `${scripts["e2e:android:ci"]} --ci --configuration=production`;
    scripts["e2e:js:ci"] = `${scripts["e2e:js:ci"]} --ci`;

    scripts["deploy:ios"] = "nx deploy:ios $@";
    scripts["deploy:ios:ci"] = "yarn deploy:ios";

    scripts["deploy:android"] = "nx deploy:android $@";
    scripts["deploy:android:ci"] = "yarn deploy:android";

    packageJson.scripts = scripts;

    return packageJson;
  });
}

function updateHuskyPrePushCommand(project: Project) {
  const tree = project.getTree();

  // It's too cumbersome to run native tests pre-push. Run just the JS tests.
  replaceInFile(
    tree,
    ".husky/pre-push",
    "yarn test:affected",
    "yarn test:js:affected",
  );
}

function addScriptsForTarget(target: string, scripts: Record<string, string>) {
  const outputOptions = "--output-style=stream --verbose";
  const allTargets = `--target=${target} --target=${target}:android --target=${target}:ios`;

  scripts[`${target}:all`] = `nx run-many ${allTargets} ${outputOptions}`;
  scripts[`${target}:affected`] = `nx affected ${allTargets} ${outputOptions}`;
  // In the context of CI, a different environment is necessary to build each platform.
  // It therefore doesn't make much sense to run non-JS targets here--we'll just run
  // JS-only by default.
  scripts[`${target}:ci`] = `yarn ${target}:js:ci`;

  scripts[
    `${target}:ios:all`
  ] = `nx run-many --target=${target}:ios --all ${outputOptions}`;
  scripts[
    `${target}:ios:affected`
  ] = `nx affected --target=${target}:ios ${outputOptions}`;
  scripts[`${target}:ios:ci`] = `./scripts/ci.sh ${target}:ios`;

  scripts[
    `${target}:android:all`
  ] = `nx run-many --target=${target}:android --all ${outputOptions}`;
  scripts[
    `${target}:android:affected`
  ] = `nx affected --target=${target}:android ${outputOptions}`;
  scripts[`${target}:android:ci`] = `./scripts/ci.sh ${target}:android`;

  scripts[
    `${target}:js:all`
  ] = `nx run-many --target=${target} --all ${outputOptions}`;
  scripts[
    `${target}:js:affected`
  ] = `nx affected --target=${target} ${outputOptions}`;
  scripts[`${target}:js:ci`] = `./scripts/ci.sh ${target}:js`;
}

function updateYarnWorkspaces(project: Project) {
  const tree = project.getTree();

  updateJson(tree, "package.json", (packageJson: PackageJson) => {
    const workspaces = (packageJson.workspaces ?? { packages: [] }) as {
      packages: string[];
    };

    // React Native apps require symlinks for node_modules which break
    // if the package is allowed to be part of the yarn workspace.
    workspaces.packages.push(`!${project.path()}`);

    packageJson.workspaces = workspaces;

    return packageJson;
  });
}

function updateProjectJson(project: Project) {
  const tree = project.getTree();
  const projectJsonPath = project.path("project.json");

  replaceInFile(tree, projectJsonPath, "bundle-ios", "bundle:ios");
  replaceInFile(
    tree,
    project.path("project.json"),
    "bundle-android",
    "bundle:android",
  );
  replaceInFile(tree, projectJsonPath, "build-ios", "build:ios");
  replaceInFile(
    tree,
    project.path("project.json"),
    "build-android",
    "build:android",
  );
  replaceInFile(tree, projectJsonPath, "run-ios", "run:ios");
  replaceInFile(
    tree,
    project.path("project.json"),
    "run-android",
    "run:android",
  );

  // Default project.json doesn't include sync-deps as a dependency for bundling targets,
  // which causes an error if bundle is ever run without running build first.
  updateJson(tree, projectJsonPath, (projectJson: ProjectConfiguration) => {
    ProjectJsonUtils.addTargetDependency(
      projectJson,
      "bundle:android",
      "sync-deps",
    );
    ProjectJsonUtils.addTargetDependency(
      projectJson,
      "bundle:ios",
      "sync-deps",
    );

    ProjectJsonUtils.upsertTarget(projectJson, "pod-install", {
      command: "bundle exec pod install --project-directory=./ios",
      options: {
        cwd: project.path(),
      },
    });
    ProjectJsonUtils.upsertTarget(projectJson, "build:android", {
      executor: "nx:run-commands",
      options: {
        cwd: project.path(),
      },
      defaultConfiguration: "release",
      configurations: {
        release: {
          command: "bundle exec fastlane android build",
        },
        debug: {
          command: "bundle exec fastlane android build build_type:debug",
        },
        "bundle-release": {
          command: "bundle exec fastlane android build task:bundle",
        },
        "test-release": {
          command:
            "bundle exec fastlane android build build_type:release test:true",
        },
        "test-debug": {
          command:
            "bundle exec fastlane android build build_type:debug test:true",
        },
      },
      outputs: [
        "{projectRoot}/android/app/build/outputs/bundle",
        "{projectRoot}/android/app/build/outputs/apk",
      ],
      dependsOn: ["ensure-symlink", "sync-deps"],
    });
    ProjectJsonUtils.upsertTarget(projectJson, "build:ios", {
      executor: "nx:run-commands",
      options: {
        cwd: project.path(),
      },
      defaultConfiguration: "release",
      configurations: {
        debug: {
          command: "bundle exec fastlane ios build configuration:debug",
        },
        release: {
          command: "bundle exec fastlane ios build configuration:release",
        },
        "debug-simulator": {
          command:
            "bundle exec fastlane ios build configuration:debug simulator:true",
        },
        "release-simulator": {
          command:
            "bundle exec fastlane ios build configuration:release simulator:true",
        },
      },
      outputs: ["{projectRoot}/ios/build/Build"],
      dependsOn: ["ensure-symlink", "sync-deps", "pod-install"],
    });
    ProjectJsonUtils.upsertTarget(projectJson, "test:android", {
      command: "bundle exec fastlane android test",
      options: {
        cwd: project.path(),
      },
      dependsOn: ["ensure-symlink", "sync-deps"],
    });
    ProjectJsonUtils.upsertTarget(projectJson, "test:ios", {
      command: "bundle exec fastlane ios test",
      options: {
        cwd: project.path(),
      },
      dependsOn: ["ensure-symlink", "sync-deps", "pod-install"],
    });
    ProjectJsonUtils.upsertTarget(projectJson, "deploy:android", {
      executor: "nx:run-commands",
      options: {
        cwd: project.path(),
      },
      defaultConfiguration: "beta",
      configurations: {
        beta: {
          command: "bundle exec fastlane android beta",
        },
        production: {
          command: "bundle exec fastlane android deploy",
        },
      },
      dependsOn: ["ensure-symlink", "sync-deps"],
    });
    ProjectJsonUtils.upsertTarget(projectJson, "deploy:ios", {
      executor: "nx:run-commands",
      options: {
        cwd: project.path(),
      },
      defaultConfiguration: "beta",
      configurations: {
        beta: {
          command: "bundle exec fastlane ios beta",
        },
        production: {
          command: "bundle exec fastlane ios deploy",
        },
      },
      dependsOn: ["ensure-symlink", "sync-deps", "pod-install"],
    });

    return projectJson;
  });
}

/* eslint-disable security/detect-non-literal-fs-filename */
function updateCodeSample(project: Project) {
  const tree = project.getTree();

  tree.rename(
    project.srcPath("app/App.spec.tsx"),
    project.testPath("unit/App.spec.tsx"),
  );

  replaceInFile(
    tree,
    project.testPath("unit/App.spec.tsx"),
    "import App from './App';",
    "import App from '../../src/app/App';",
  );

  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "/* eslint-disable jsx-a11y/accessible-emoji */\n",
    "",
  );

  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "onPress={() =>\n",
    "// eslint-disable-next-line @typescript-eslint/no-misused-promises\nonPress={() =>\n",
  );
}
/* eslint-enable security/detect-non-literal-fs-filename */

function installPods(project: Project) {
  const pmc = getPackageManagerCommand();

  return async () => {
    await spawn(`${pmc.exec} nx pod-install ${project.getName()}`, {
      cwd: project.getTree().root,
    });
  };
}

function updateNativeProjects(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = project.getTree();

  replaceInFile(tree, project.path("Gemfile"), "'", '"');
  replaceInFile(
    tree,
    project.path("Gemfile"),
    'ruby ">= 2.6.10"',
    'ruby ">= 3.2.2"',
  );
  replaceInFile(
    tree,
    project.path("Gemfile"),
    'gem "cocoapods", "~> 1.12"\n',
    endent`
      # Temporary patch until cocoapods releases a patch: https://stackoverflow.com/a/77237290/599391
      gem "activesupport", "~> 7.0", "<= 7.0.8"
      gem "cocoapods", "~> 1.12"
    `,
  );

  updateIosProject(project, options);
  updateAndroidProject(project, options);
}

function updateIosProject(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = project.getTree();

  const iosProjectName = project.getNames().pascalCase;
  const iosXcodeProjectPath = project.path(
    `ios/${iosProjectName}.xcodeproj/project.pbxproj`,
  );

  const { appId, appName } = options;

  replaceInFile(tree, project.path("ios/Podfile"), "'", '"');
  // There is one instance of a good single quote in this file that we need to allow
  replaceInFile(
    tree,
    project.path("ios/Podfile"),
    '"require.resolve(',
    "'require.resolve(",
  );
  replaceInFile(
    tree,
    project.path("ios/Podfile"),
    ')", __dir__]).strip',
    ")', __dir__]).strip",
  );

  // This patches a bug in Nx's generated project where some commands will open a useless
  // Metro terminal that is unable to find the metro config
  replaceInFile(
    tree,
    iosXcodeProjectPath,
    'export RCT_METRO_PORT=\\"${RCT_METRO_PORT:=8081}\\"\\necho \\"export RCT_METRO_PORT=${RCT_METRO_PORT}\\" >',
    'export RCT_METRO_PORT=\\"${RCT_METRO_PORT:=8081}\\"\\nexport PROJECT_ROOT=${SRCROOT}\\necho \\"export RCT_METRO_PORT=${RCT_METRO_PORT}\\\\nexport PROJECT_ROOT=${PROJECT_ROOT}\\" >',
  );

  replaceInFile(
    tree,
    iosXcodeProjectPath,
    "org.reactjs.native.example.$(PRODUCT_NAME:rfc1034identifier)",
    appId,
  );

  replaceInFile(
    tree,
    project.path(`ios/${iosProjectName}/Info.plist`),
    "\t<key>CFBundleName</key>\n\t<string>$(PRODUCT_NAME)</string>\n",
    "\t<key>CFBundleName</key>\n\t<string>$(PRODUCT_NAME)</string>\n\t<key>CFBundleIconName</key>\n\t<string>AppIcon</string>\n",
  );

  replaceInFile(
    tree,
    project.path(`ios/${iosProjectName}Tests/${iosProjectName}Tests.m`),
    "Welcome to React",
    `Welcome ${appName} 👋`,
  );

  const templateDir = path.join(__dirname, "./files/ios");

  generateFiles(tree, templateDir, project.path("ios"), {
    iosProjectName,
    ...options,
  });
}

function updateAndroidProject(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = project.getTree();

  const { appId } = options;
  const packageName = appId.toLowerCase();

  const oldPackageName = `com.${project.getNames().camelCase.toLowerCase()}`;

  const oldPackageDir = oldPackageName.split(".").join("/");
  const packageDir = packageName.split(".").join("/");

  replaceInFile(
    tree,
    project.path("android/app/build.gradle"),
    `namespace "${oldPackageName}"`,
    `namespace "${packageName}"`,
  );

  replaceInFile(
    tree,
    project.path("android/app/build.gradle"),
    `applicationId "${oldPackageName}"`,
    `applicationId "${appId}"`,
  );

  const configurations = ["androidTest", "debug", "main", "release"];

  for (const configuration of configurations) {
    const javaDir = project.path(`android/app/src/${configuration}/java`);
    moveJavaPackage(
      tree,
      path.join(javaDir, oldPackageDir),
      path.join(javaDir, packageDir),
      oldPackageName,
      packageName,
    );
  }
}

function moveJavaPackage(
  tree: Tree,
  oldDir: string,
  newDir: string,
  oldPackageName: string,
  newPackageName: string,
) {
  moveFilesToNewDirectory(tree, oldDir, newDir);

  const children = tree.children(newDir);

  for (const child of children) {
    if (child.endsWith(".java")) {
      replaceInFile(
        tree,
        path.join(newDir, child),
        `package ${oldPackageName}`,
        `package ${newPackageName}`,
      );
    }
  }
}

function updateE2eProject(
  e2eProject: Project,
  project: Project,
  originalE2eBaseDir: string,
  options: ReactNativeAppGeneratorSchema,
) {
  moveE2eProject(
    e2eProject,
    path.join(originalE2eBaseDir, e2eProject.getName()),
  );
  updateE2eProjectJson(e2eProject, project, originalE2eBaseDir);
  updateE2eTsConfig(e2eProject);
  updateE2eTestSetup(e2eProject, project, options);

  eslintProjectGenerator(e2eProject.getTree(), {
    ...e2eProject.getMeta(),
    noPrimaryTsConfig: true,
  });

  updateE2eCodeSample(e2eProject);
}

function moveE2eProject(e2eProject: Project, originalE2eProjectDir: string) {
  const tree = e2eProject.getTree();

  moveFilesToNewDirectory(tree, originalE2eProjectDir, e2eProject.path());
}

function updateE2eProjectJson(
  e2eProject: Project,
  project: Project,
  originalE2eBaseDir: string,
) {
  const tree = e2eProject.getTree();
  const e2eProjectJsonPath = e2eProject.path("project.json");
  const newE2eBaseDir = e2eProject.relativePath("..");

  replaceInFile(tree, e2eProjectJsonPath, "build-ios", "build-e2e:ios");
  replaceInFile(tree, e2eProjectJsonPath, "build-android", "build-e2e:android");
  replaceInFile(tree, e2eProjectJsonPath, "test-ios", "e2e:ios");
  replaceInFile(tree, e2eProjectJsonPath, "test-android", "e2e:android");

  updateJson(tree, e2eProjectJsonPath, (projectJson: ProjectConfiguration) => {
    const { targets } = projectJson;

    if (!targets?.lint) {
      return projectJson;
    }

    const lintTarget =
      targets.lint as TargetConfiguration<EsLintExecutorOptions>;

    if (!lintTarget.options) {
      return projectJson;
    }

    const lintFilePatterns = lintTarget.options.lintFilePatterns;

    if (!lintFilePatterns) {
      return projectJson;
    }

    const newLintFilePatterns = lintFilePatterns.map((pattern: string) => {
      return pattern.replace(originalE2eBaseDir, newE2eBaseDir);
    });

    lintTarget.options.lintFilePatterns = newLintFilePatterns;

    return projectJson;
  });
}

function updateE2eTsConfig(e2eProject: Project) {
  const tree = e2eProject.getTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  tree.rename(
    e2eProject.path("tsconfig.e2e.json"),
    e2eProject.path("tsconfig.spec.json"),
  );

  replaceInFile(
    tree,
    e2eProject.path("tsconfig.json"),
    "tsconfig.e2e.json",
    "tsconfig.spec.json",
  );

  replaceInFile(tree, e2eProject.path("tsconfig.spec.json"), "src", "test");
}

function updateE2eTestSetup(
  e2eProject: Project,
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = e2eProject.getTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  tree.rename(
    e2eProject.path("test-setup.ts"),
    e2eProject.testPath("setup/setup.ts"),
  );

  updateJson(
    tree,
    e2eProject.path("jest.config.json"),
    (config: JestConfig) => {
      config.setupFilesAfterEnv = ["<rootDir>/test/setup/setup.ts"];
      config.coverageDirectory = `../../reports/coverage/${e2eProject.relativePath()}`;
      config.reporters = [
        [
          "jest-junit",
          {
            addFileAttribute: "true",
            classNameTemplate: "{suitename}",
            outputDirectory: "reports/junit",
            outputName: `${e2eProject.getName()}.xml`,
          },
        ],
      ];

      return config;
    },
  );

  replaceInFile(tree, e2eProject.path("jest.config.json"), "src", "test");

  tree.delete(e2eProject.path(".detoxrc.json"));

  const templateDir = path.join(__dirname, "./files/e2eProject");

  generateFiles(tree, templateDir, e2eProject.path(), {
    ...options,
    projectName: project.getName(),
    projectPath: project.path(),
    iosProjectName: project.getNames().pascalCase,
  });
}

function updateE2eCodeSample(e2eProject: Project) {
  const tree = e2eProject.getTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  tree.rename(
    e2eProject.srcPath("app.spec.ts"),
    e2eProject.testPath("e2e/app.spec.ts"),
  );

  tree.delete(e2eProject.srcPath());
}
