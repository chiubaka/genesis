import {
  detectPackageManager,
  generateFiles,
  getPackageManagerCommand,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/node";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { noOpTask, Project } from "../../../utils";
import { eslintProjectGenerator, readmeProjectGenerator } from "../../project";
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

  eslintProjectGenerator(tree, {
    projectName: projectName,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName: projectName,
    projectType,
    rootProjectGeneratorName: "lib.node",
  });

  const e2eGeneratorTask = skipE2e
    ? noOpTask
    : await nodeLibE2eGenerator(tree, {
        scope: projectScope,
        name: `${projectName}-e2e`,
      });

  updatePackageJsonScripts(project);
  copyTemplateFiles(project);

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

function copyTemplateFiles(project: Project) {
  const tree = project.getTree();

  tree.delete(project.path(".babelrc"));
  tree.delete(project.srcPath());

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    template: "",
    projectName: project.getName(),
  });
}
