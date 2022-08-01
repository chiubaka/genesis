import {
  formatFiles,
  getWorkspaceLayout,
  installPackagesTask,
  names,
  readWorkspaceConfiguration,
  Tree,
  updateWorkspaceConfiguration,
} from "@nrwl/devkit";

import lintingGenerator from "../linting";
import { PresetGeneratorSchema } from "./presetGenerator.schema";

interface NormalizedSchema extends PresetGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema,
) {
  options = normalizeOptions(tree, options);

  modifyWorkspaceLayout(tree);
  lintingGenerator(tree);

  if (!options.skipInstall) {
    reinstallPackagesWithYarn(tree);
  }

  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: PresetGeneratorSchema,
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp("/", "g"), "-");
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(",").map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function modifyWorkspaceLayout(tree: Tree) {
  const workspaceConfig = readWorkspaceConfiguration(tree);
  updateWorkspaceConfiguration(tree, {
    ...workspaceConfig,
    workspaceLayout: {
      appsDir: "e2e",
      libsDir: "packages",
    },
    cli: {
      packageManager: "yarn",
    },
  });

  tree.delete("apps");
  tree.delete("libs");

  tree.write("e2e/.gitkeep", "");
  tree.write("packages/.gitkeep", "");
}

function reinstallPackagesWithYarn(tree: Tree) {
  tree.delete("package-lock.json");
  installPackagesTask(tree, true, undefined, "yarn");
}
