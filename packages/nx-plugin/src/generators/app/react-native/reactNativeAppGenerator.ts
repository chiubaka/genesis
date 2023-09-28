import {
  moveFilesToNewDirectory,
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  updateJson,
} from "@nx/devkit";
import * as Detox from "detox";
import path from "node:path";

import { EsLintExecutorOptions, PackageJson } from "../../../types";
import { Project, replaceInFile } from "../../../utils";
import {
  eslintProjectGenerator,
  reactNativeProjectGenerator,
} from "../../project";
import { ReactNativeAppGeneratorSchema } from "./reactNativeAppGenerator.schema";

export async function reactNativeAppGenerator(
  tree: Tree,
  options: ReactNativeAppGeneratorSchema,
) {
  const { name, displayName } = options;
  const project = new Project(tree, name, "application");
  const e2eProject = new Project(tree, `${name}-e2e`, "e2e");

  const reactNativeProjectTask = await reactNativeProjectGenerator(tree, {
    ...project.getMeta(),
    displayName,
    rootProjectGeneratorName: "app.react-native",
  });

  updateYarnWorkspaces(project);
  updateNativeProjects(project, options);
  updateCodeSample(project);

  const originalE2eBaseDir = project.relativePath("..");
  updateE2eProject(e2eProject, originalE2eBaseDir, options);

  return async () => {
    await reactNativeProjectTask();
  };
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

function updateNativeProjects(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
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

  const { packageName } = options;

  replaceInFile(tree, project.path("Gemfile"), "'", '"');
  replaceInFile(tree, project.path("ios/Podfile"), "'", '"');

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
    packageName,
  );
}

function updateAndroidProject(
  project: Project,
  options: ReactNativeAppGeneratorSchema,
) {
  const tree = project.getTree();

  const { packageName } = options;

  const originalPackageName = `com.${project
    .getNames()
    .camelCase.toLowerCase()}`;

  replaceInFile(
    tree,
    project.path("android/app/build.gradle"),
    originalPackageName,
    packageName,
  );
}

function updateE2eProject(
  e2eProject: Project,
  originalE2eBaseDir: string,
  options: ReactNativeAppGeneratorSchema,
) {
  moveE2eProject(
    e2eProject,
    path.join(originalE2eBaseDir, e2eProject.getName()),
  );
  updateE2eProjectJson(e2eProject, originalE2eBaseDir);
  updateE2eTsConfig(e2eProject);
  updateE2eTestSetup(e2eProject, options);

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

function updateE2eProjectJson(e2eProject: Project, originalE2eBaseDir: string) {
  const tree = e2eProject.getTree();

  const newE2eBaseDir = e2eProject.relativePath("..");

  updateJson(
    tree,
    e2eProject.path("project.json"),
    (projectJson: ProjectConfiguration) => {
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
    },
  );
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
    (config: { setupFilesAfterEnv?: string[] }) => {
      config.setupFilesAfterEnv = ["<rootDir>/test/setup/setup.ts"];

      return config;
    },
  );

  replaceInFile(tree, e2eProject.path("jest.config.json"), "src", "test");

  updateJson(
    tree,
    e2eProject.path(".detoxrc.json"),
    (config: Detox.DetoxConfig) => {
      const devices = config.devices;

      if (!devices) {
        return config;
      }

      const iosSimulatorConfig =
        devices.simulator as Detox.DetoxIosSimulatorDriverConfig;
      const androidEmulatorConfig =
        devices.emulator as Detox.DetoxAndroidEmulatorDriverConfig;

      if (iosSimulatorConfig) {
        const deviceConfig =
          iosSimulatorConfig.device as Partial<Detox.IosSimulatorQuery>;

        iosSimulatorConfig.device = {
          ...deviceConfig,
          type: options.iosSimulatorDeviceType ?? deviceConfig.type,
        };
      }

      if (androidEmulatorConfig) {
        const deviceConfig = androidEmulatorConfig.device as {
          avdName: string;
        };

        androidEmulatorConfig.device = {
          avdName: options.androidEmulatorAvdName ?? deviceConfig.avdName,
        };
      }

      return config;
    },
  );
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
