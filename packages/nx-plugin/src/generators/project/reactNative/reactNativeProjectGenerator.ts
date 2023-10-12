import { Tree } from "@nx/devkit";
import { Linter } from "@nx/linter";
import {
  reactNativeApplicationGenerator,
  reactNativeLibraryGenerator,
} from "@nx/react-native";

import { addDependenciesToPackageJson, lintFix, Project } from "../../../utils";
import { projectGenerator } from "../project";
import { TsConfigGeneratorPresets } from "../tsconfig";
import { ReactNativeProjectGeneratorSchema } from "./reactNativeProjectGeneratorSchema";

export async function reactNativeProjectGenerator(
  tree: Tree,
  options: ReactNativeProjectGeneratorSchema,
) {
  const project = Project.createFromOptions(tree, options);

  const baseGeneratorTask = await baseGenerator(project, options);

  const installDependenciesTask = await installDependencies(tree);

  const projectGeneratorTask = await projectGenerator(tree, {
    ...options,
    reactNative: true,
    enableReact: true,
    tsconfig: TsConfigGeneratorPresets.REACT,
    skipRelocation: true,
  });

  updateTestingSetup(project);

  return async () => {
    await baseGeneratorTask();
    await installDependenciesTask();
    await projectGeneratorTask();
    await lintFix(tree.root);
  };
}

function baseGenerator(
  project: Project,
  options: ReactNativeProjectGeneratorSchema,
) {
  const { displayName, tags } = options;
  const tree = project.getTree();

  return getBaseGenerator(project)(tree, {
    name: project.getName(),
    displayName: displayName,

    directory: project.relativePath(".."),
    importPath: project.getImportPath(),

    e2eTestRunner: "detox",
    install: true,
    linter: Linter.EsLint,
    pascalCaseFiles: true,
    publishable: true,
    skipFormat: true,
    skipTsConfig: false,
    strict: true,
    style: "scss",
    tags,
    unitTestRunner: "jest",
  });
}

function getBaseGenerator(project: Project) {
  const projectType = project.getType();

  if (projectType === "library") {
    return reactNativeLibraryGenerator;
  }

  return reactNativeApplicationGenerator;
}

function installDependencies(tree: Tree) {
  // Ensure that we install the latest @types/react and @types/react-native, since
  // the versions pegged by Nx sometimes produce typings conflicts
  return addDependenciesToPackageJson(
    tree,
    [],
    ["@types/react", "@types/react-native", "@types/react-test-renderer"],
  );
}

function updateTestingSetup(project: Project) {
  const tree = project.getTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  tree.rename(
    project.path("test-setup.ts"),
    project.testPath("setup/setup.ts"),
  );
}
