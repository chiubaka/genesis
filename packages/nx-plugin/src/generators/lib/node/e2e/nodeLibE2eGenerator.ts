import {
  generateFiles,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";

import { nodeProjectGenerator } from "../../../project";
import { addDependenciesToPackageJson, Project } from "../../../../utils";
import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema,
) {
  const { libName, name, rootProjectGeneratorName } = options;
  const project = new Project(tree, name, "e2e");
  const libProject = new Project(tree, libName, "library");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName,
  });

  copyTemplates(project, libProject);
  const installTask = await addDependenciesToPackageJson(
    tree,
    { [libProject.getImportPath()]: `file:../../${libProject.distPath()}` },
    {},
    project.path("package.json"),
  );
  updateProjectJson(project, libName);

  return async () => {
    await nodeProjectTask();
    await installTask();
  };
}

function copyTemplates(project: Project, libProject: Project) {
  const tree = project.getTree();
  const libScope = libProject.getScope();
  const libName = libProject.getName();

  tree.delete(project.srcPath("app"));

  generateFiles(tree, path.join(__dirname, "./files"), project.path(), {
    libScope,
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

      targets.install = {
        executor: "@nrwl/workspace:run-commands",

        dependsOn: [{ target: "build", projects: "dependencies" }],
        options: {
          commands: ["yarn cache clean --all", "yarn install"],
          cwd: project.path(),
          parallel: false,
        },
      };

      const testTarget = targets.test;
      testTarget.dependsOn = testTarget.dependsOn || [];
      testTarget.dependsOn.push({
        target: "install",
        projects: "self",
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
