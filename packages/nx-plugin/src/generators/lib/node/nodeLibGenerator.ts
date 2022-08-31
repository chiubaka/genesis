import {
  detectPackageManager,
  getPackageManagerCommand,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { PackageJson } from "nx/src/utils/package-json";

import { noOpTask, Project } from "../../../utils";
import { copyNodeLibSample, nodeProjectGenerator } from "../../project";
import { nodeLibE2eGenerator } from "./e2e";
import { NodeLibGeneratorSchema } from "./nodeLibGenerator.schema";

export async function nodeLibGenerator(
  tree: Tree,
  options: NodeLibGeneratorSchema,
) {
  const { name, localRegistry } = options;
  const project = new Project(tree, name, "library");

  const nodeProjectTask = await nodeProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "lib.node",
  });

  updatePackageJsonScripts(project);
  updateProjectJson(project, localRegistry);
  copyNodeLibSample(project);

  const e2eProjectTask = await generateE2eProject(project, options);

  return async () => {
    await nodeProjectTask();
    await e2eProjectTask();
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

function updateProjectJson(project: Project, localRegistry: string) {
  const tree = project.getTree();

  updateJson(
    tree,
    project.path("project.json"),
    (projectJson: ProjectConfiguration) => {
      if (!projectJson.targets) {
        projectJson.targets = {};
      }

      projectJson.targets["publish:local"] = {
        executor: "@chiubaka/nx-plugin:publish-local",
        dependsOn: [{ target: "build", projects: "self" }],
        options: {
          registryUrl: localRegistry,
          packagePath: project.distPath(),
        },
      };

      return projectJson;
    },
  );
}

function generateE2eProject(project: Project, options: NodeLibGeneratorSchema) {
  const tree = project.getTree();
  const projectName = project.getName();
  const { localRegistry, skipE2e } = options;

  if (skipE2e) {
    return noOpTask;
  }

  return nodeLibE2eGenerator(tree, {
    name: `${projectName}-e2e`,
    libName: projectName,
    localRegistry: localRegistry,
    rootProjectGeneratorName: "lib.node",
  });
}
