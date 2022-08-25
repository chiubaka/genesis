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

import { projectNameCasings, ProjectNames } from "../../../utils";
import { NodeLibGeneratorSchema } from "./nodeLibGenerator.schema";

interface NodeLibGeneratorTemplateValues {
  codecov?: CodecovTemplateValues;
  template: "";
  generatorName: string;
  projectName: ProjectNames;
  scope: string;
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
  const { scope, name } = options;
  const projectName = projectNameCasings(name);
  const { libsDir } = getWorkspaceLayout(tree);
  const projectDir = path.join(libsDir, projectName.kebabCase);

  const baseGeneratorTask = await libraryGenerator(tree, {
    ...options,
    compiler: "tsc",
    importPath: `@${scope}/${projectName.kebabCase}`,
    pascalCaseFiles: true,
    strict: true,
    buildable: true,
  });

  updatePackageJsonScripts(tree, projectDir);

  const codecov = getCodecovTemplateValues(tree);

  copyTemplateFiles(tree, projectDir, {
    codecov,
    generatorName: "node-lib",
    projectName,
    scope,
    template: "",
  });

  return async () => {
    await baseGeneratorTask();
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

function getCodecovTemplateValues(
  tree: Tree,
): CodecovTemplateValues | undefined {
  const rootReadme = tree.read("README.md")?.toString();

  if (!rootReadme) {
    return;
  }

  const codecovRegex =
    // eslint-disable-next-line security/detect-unsafe-regex
    /\[!\[codecov]\(ht{2}ps:\/{2}codecov\.io\/gh\/(?<repoOrg>[.A-Z_a-z-]+)\/(?<repoName>[.A-Z_a-z-]+)\/branch\/master\/graph\/badge\.svg\?token=(?<token>\w+)\)]\(ht{2}ps:\/{2}codecov\.io\/gh(?:\/[.A-Z_a-z-]+){2}\)/;

  const match = rootReadme.match(codecovRegex);

  if (!match) {
    return;
  }

  const groups = match.groups;

  if (!groups) {
    return;
  }

  return {
    repoOrg: groups.repoOrg,
    repoName: groups.repoName,
    token: groups.token,
  };
  // return match.groups as NodeLibGeneratorTemplateValues["codecov"];
}

function copyTemplateFiles(
  tree: Tree,
  projectDir: string,
  templateValues: NodeLibGeneratorTemplateValues,
) {
  const srcDir = path.join(projectDir, "./src");

  tree.delete(srcDir);
  generateFiles(
    tree,
    path.join(__dirname, "./files"),
    projectDir,
    templateValues,
  );
}
