import {
  generateFiles,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";

import { nodeProjectGenerator } from "../../../project";
import { Project, updateYaml } from "../../../../utils";
import { DockerComposeConfig, VerdaccioConfig } from "../../../../types";
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
  updateProjectJson(project, libName);
  generateDockerComposeVerdaccioConfig(project, libProject);

  return async () => {
    await nodeProjectTask();
  };
}

function copyTemplates(project: Project, libProject: Project) {
  const tree = project.getTree();
  const libScope = libProject.getScope();
  const libName = libProject.getName();

  tree.delete(project.srcPath("app"));

  generateFiles(tree, path.join(__dirname, "./files/project"), project.path(), {
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

        dependsOn: [{ target: "publish:local", projects: "dependencies" }],
        options: {
          commands: ["yarn cache clean --all", "yarn install"],
          cwd: project.path(),
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

function generateDockerComposeVerdaccioConfig(
  project: Project,
  libProject: Project,
) {
  const tree = project.getTree();

  if (tree.exists("docker-compose.yml")) {
    addRegistryServiceToDockerCompose(libProject);
  } else {
    generateFiles(tree, path.join(__dirname, "./files/docker-compose"), ".", {
      containerNamePrefix: libProject.getNames().snakeCase,
      template: "",
    });
  }

  if (tree.exists("verdaccio/config.yaml")) {
    addUnproxiedPackageToVerdaccio(libProject);
  } else {
    generateFiles(
      tree,
      path.join(__dirname, "./files/verdaccio"),
      "./verdaccio",
      {
        projectScope: libProject.getScope(),
        projectName: libProject.getName(),
      },
    );
  }
}

function addRegistryServiceToDockerCompose(libProject: Project) {
  const tree = libProject.getTree();

  updateYaml(
    tree,
    "docker-compose.yml",
    (dockerComposeConfig: DockerComposeConfig) => {
      const services = dockerComposeConfig.services;

      if (services.registry) {
        return dockerComposeConfig;
      }

      services.registry = {
        container_name: `${libProject.getNames().snakeCase}_registry`,
        image: "verdaccio/verdaccio",
        ports: ["4873:4873"],
        volumes: ["./verdaccio:/verdaccio/conf"],
      };

      return dockerComposeConfig;
    },
  );
}

function addUnproxiedPackageToVerdaccio(libProject: Project) {
  const tree = libProject.getTree();
  const libScope = libProject.getScope();
  const libName = libProject.getName();

  updateYaml(
    tree,
    "verdaccio/config.yaml",
    (verdaccioConfig: VerdaccioConfig) => {
      verdaccioConfig.packages[`@${libScope}/${libName}`] = {
        access: "$all",
        publish: "$authenticated",
        unpublish: "$authenticated",
      } as any;

      return verdaccioConfig;
    },
  );
}
