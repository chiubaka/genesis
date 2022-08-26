import {
  detectPackageManager,
  generateFiles,
  getPackageManagerCommand,
  getWorkspaceLayout,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/node";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

import { noOpTask, projectNameCasings, ProjectNames } from "../../../utils";
import { eslintProjectGenerator, readmeProjectGenerator } from "../../project";
import { nodeLibE2eGenerator } from "./e2e";
import { NodeLibGeneratorSchema } from "./nodeLibGenerator.schema";

interface NodeLibGeneratorTemplateValues {
  codecov?: CodecovTemplateValues;
  template: "";
  generatorName: string;
  scope: string;
  projectName: ProjectNames;
}

interface CodecovTemplateValues {
  token: string;
  repoOrg: string;
  repoName: string;
}

export async function nodeLibGenerator(
  tree: Tree,
  options: NodeLibGeneratorSchema,
) {
  const { name, skipE2e } = options;
  const projectName = projectNameCasings(name);
  const projectType = "library";

  const { libsDir, npmScope: scope } = getWorkspaceLayout(tree);
  const projectDir = path.join(libsDir, projectName.kebabCase);

  const baseGeneratorTask = await libraryGenerator(tree, {
    ...options,
    compiler: "tsc",
    importPath: `@${scope}/${projectName.kebabCase}`,
    pascalCaseFiles: true,
    strict: true,
    buildable: true,
  });

  eslintProjectGenerator(tree, {
    projectName: projectName.kebabCase,
    projectType,
  });
  readmeProjectGenerator(tree, {
    projectName: projectName.kebabCase,
    projectType,
    rootProjectGeneratorName: "lib.node",
  });

  const e2eGeneratorTask = skipE2e
    ? noOpTask
    : await nodeLibE2eGenerator(tree, {
        scope: scope,
        name: `${projectName.kebabCase}-e2e`,
      });

  updatePackageJsonScripts(tree, projectDir);

  copyTemplateFiles(tree, projectDir, {
    generatorName: "node-lib",
    projectName,
    scope,
    template: "",
  });

  return async () => {
    await baseGeneratorTask();
    await e2eGeneratorTask();
  };
}

function updatePackageJsonScripts(tree: Tree, projectDir: string) {
  const packageManager = detectPackageManager(tree.root);
  const pmc = getPackageManagerCommand(packageManager);

  updateJson(
    tree,
    path.join(projectDir, "package.json"),
    (packageJson: PackageJson) => {
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }

      packageJson.scripts.deploy = "npm publish --access public";
      packageJson.scripts["deploy:ci"] = pmc.run("deploy", "").trim();

      return packageJson;
    },
  );
}

function copyTemplateFiles(
  tree: Tree,
  projectDir: string,
  templateValues: NodeLibGeneratorTemplateValues,
) {
  const srcDir = path.join(projectDir, "./src");

  tree.delete(path.join(projectDir, ".babelrc"));
  tree.delete(srcDir);
  generateFiles(
    tree,
    path.join(__dirname, "./files"),
    projectDir,
    templateValues,
  );
}
