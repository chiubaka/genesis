import { generateFiles, Tree } from "@nx/devkit";
import path from "node:path";

import { Project } from "../../../utils";
import { ReadmeProjectGeneratorSchema } from "./readmeProjectGenerator.schema";

interface CodecovTemplateValues {
  token: string;
  repoOrg: string;
  repoName: string;
}

export function readmeProjectGenerator(
  tree: Tree,
  options: ReadmeProjectGeneratorSchema,
) {
  const {
    projectName,
    projectType,
    rootProjectGeneratorName,
    additionalSetupSteps,
  } = options;

  const project = new Project(tree, projectName, projectType);

  copyReadmeTemplate(project, rootProjectGeneratorName, additionalSetupSteps);
}

function copyReadmeTemplate(
  project: Project,
  rootProjectGeneratorName: string,
  additionalSetupSteps?: string,
) {
  const tree = project.getTree();
  const npmScope = project.getScope();

  const codecov = getCodecovTemplateValues(tree);

  const templateDir = path.join(__dirname, "./files");

  generateFiles(tree, templateDir, project.path(), {
    codecov,
    npmScope,
    projectName: project.getName(),
    rootProjectGeneratorName,
    additionalSetupSteps,
  });
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
}
