import {
  detectPackageManager,
  getPackageManagerCommand,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/node";
import { PackageJson } from "nx/src/utils/package-json";

import { noOpTask, Project } from "../../../utils";
import {
  copyNodeLibSample,
  eslintProjectGenerator,
  jestProjectGenerator,
  readmeProjectGenerator,
  standardizeProjectJson,
  TsConfigGeneratorPresets,
  tsconfigProjectGenerator,
} from "../../project";
import { nodeLibE2eGenerator } from "./e2e";
import { NodeLibGeneratorSchema } from "./nodeLibGenerator.schema";

export async function nodeLibGenerator(
  tree: Tree,
  options: NodeLibGeneratorSchema,
) {
  const { name, skipE2e } = options;
  const project = new Project(tree, name, "library");
  const projectScope = project.getScope();
  const projectName = project.getName();
  const projectType = project.getType();

  const baseGeneratorTask = await libraryGenerator(tree, {
    ...options,
    compiler: "tsc",
    importPath: `@${projectScope}/${projectName}`,
    pascalCaseFiles: true,
    strict: true,
    buildable: true,
  });

  tsconfigProjectGenerator(tree, {
    projectName,
    projectType,
    ...TsConfigGeneratorPresets.node18,
  });
  jestProjectGenerator(tree, {
    projectName,
    projectType,
    testEnvironment: "node",
  });
  eslintProjectGenerator(tree, {
    projectName,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName,
    projectType,
    rootProjectGeneratorName: "lib.node",
  });

  const e2eGeneratorTask = skipE2e
    ? noOpTask
    : await nodeLibE2eGenerator(tree, {
        scope: projectScope,
        name: `${projectName}-e2e`,
      });

  standardizeProjectJson(project);
  updatePackageJsonScripts(project);
  copyNodeLibSample(project);

  return async () => {
    await baseGeneratorTask();
    await e2eGeneratorTask();
  };
}

function updatePackageJsonScripts(project: Project) {
  const tree = project.getTree();

  const packageManager = detectPackageManager(tree.root);
  const pmc = getPackageManagerCommand(packageManager);

  updateJson(tree, project.path("package.json"), (packageJson: PackageJson) => {
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts.deploy = "npm publish --access public";
    packageJson.scripts["deploy:ci"] = pmc.run("deploy", "").trim();

    return packageJson;
  });
}
