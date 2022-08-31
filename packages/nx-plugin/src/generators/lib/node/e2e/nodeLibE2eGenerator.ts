import {
  generateFiles,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { nodeProjectGenerator } from "../../../project";

import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";
import { Project } from "../../../..";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema,
) {
  const { libName, name, rootProjectGeneratorName } = options;
  const project = new Project(tree, name, "e2e");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  copyTemplates(project, libName);
  updateProjectJson(project, libName);

  return async () => {
    await nodeProjectTask();
  };
}

function copyTemplates(project: Project, libName: string) {
  const tree = project.getTree();

  tree.delete(project.srcPath("app"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    libScope: project.getScope(),
    libName,
    template: "",
  });
}

function updateProjectJson(project: Project, libName: string) {
  const tree = project.getTree();

  updateJson(
    tree,
    project.path("project.json"),
    (projectJson: ProjectConfiguration) => {
      const targets = projectJson.targets;

      if (!targets) {
        return projectJson;
      }

      const testTarget = targets.test;
      testTarget.dependsOn = testTarget.dependsOn || [];
      testTarget.dependsOn.push({
        target: "publish:local",
        projects: "dependencies",
      });

      targets.e2e = testTarget;

      delete targets.test;
      delete targets.serve;

      projectJson.implicitDependencies = projectJson.implicitDependencies || [];

      if (!projectJson.implicitDependencies.includes(libName)) {
        projectJson.implicitDependencies.push(libName);
      }

      return projectJson;
    },
  );
}
