import {
  formatFiles,
  getWorkspaceLayout,
  installPackagesTask,
  names,
  readWorkspaceConfiguration,
  Tree,
  updateJson,
  updateWorkspaceConfiguration,
} from "@nrwl/devkit";

import { PresetGeneratorSchema } from "./presetGenerator.schema";

interface NormalizedSchema extends PresetGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export interface PrettierConfig {
  singleQuote?: boolean;
}

export async function presetGenerator(
  tree: Tree,
  options: PresetGeneratorSchema,
) {
  options = normalizeOptions(tree, options);

  modifyWorkspaceLayout(tree);

  updateJson<PrettierConfig>(tree, ".prettierrc", (json) => {
    delete json.singleQuote;
    return json;
  });

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

export default presetGenerator;
