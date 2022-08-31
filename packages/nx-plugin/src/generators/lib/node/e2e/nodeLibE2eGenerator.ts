import {
  generateFiles,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import path from "node:path";

import { nodeProjectGenerator } from "../../../project";
import {
  addDependenciesToPackageJson,
  Project,
  updateYaml,
} from "../../../../utils";
import { DockerComposeConfig, VerdaccioConfig } from "../../../../types";
import { NodeLibE2eGeneratorSchema } from "./nodeLibE2eGenerator.schema";
import { PackageJson } from "nx/src/utils/package-json";

export async function nodeLibE2eGenerator(
  tree: Tree,
  options: NodeLibE2eGeneratorSchema,
) {
  const { libName, name, localRegistry, rootProjectGeneratorName } = options;
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
  updateWorkspacePackageJsonScripts(project, localRegistry);
  generateDockerComposeVerdaccioConfig(project, libProject, localRegistry);

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

function updateWorkspacePackageJsonScripts(
  project: Project,
  localRegistry: string,
) {
  const tree = project.getTree();

  updateJson(tree, "package.json", (packageJson: PackageJson) => {
    if (!packageJson.scripts) {
      packageJson.scripts = {};
    }

    packageJson.scripts[
      "start:verdaccio"
    ] = `docker-compose up -d && npx npm-cli-login -u test -p test -e test@chiubaka.com -r ${localRegistry}`;

    return packageJson;
  });
}

function generateDockerComposeVerdaccioConfig(
  project: Project,
  libProject: Project,
  localRegistry: string,
) {
  const tree = project.getTree();

  if (tree.exists("docker-compose.yml")) {
    addRegistryServiceToDockerCompose(libProject, localRegistry);
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

function addRegistryServiceToDockerCompose(
  libProject: Project,
  localRegistry: string,
) {
  const tree = libProject.getTree();
  const registryPort = new URL(localRegistry).port;

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
        ports: [`${registryPort}:4873`],
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
