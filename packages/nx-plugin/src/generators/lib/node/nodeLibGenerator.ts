import { Tree } from "@nrwl/devkit";

import { noOpTask, Project } from "../../../utils";
import {
  addNpmPublishDeployScriptsToPackageJson,
  copyNodeLibSample,
  nodeProjectGenerator,
} from "../../project";
import { LibGeneratorSchema } from "../libGenerator.schema";
import { nodeLibE2eGenerator } from "./e2e";

export async function nodeLibGenerator(
  tree: Tree,
  options: LibGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "library");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "lib.node",
  });

  addNpmPublishDeployScriptsToPackageJson(project);
  copyNodeLibSample(project);

  const e2eProjectTask = await generateE2eProject(project, options);

  return async () => {
    await nodeProjectTask();
    await e2eProjectTask();
  };
}

function generateE2eProject(project: Project, options: LibGeneratorSchema) {
  const tree = project.getTree();
  const projectName = project.getName();
  const { skipE2e } = options;

  if (skipE2e) {
    return noOpTask;
  }

  return nodeLibE2eGenerator(tree, {
    name: `${projectName}-e2e`,
    appOrLibName: projectName,
    rootProjectGeneratorName: "lib.node",
  });
}
