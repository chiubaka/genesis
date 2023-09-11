import {
  ProjectConfiguration,
  TargetConfiguration,
  Tree,
  updateJson,
} from "@nx/devkit";

import { Project } from "../../utils";
import { LibGeneratorSchema } from "./libGenerator.schema";

export function libGenerator(tree: Tree, options: LibGeneratorSchema) {
  const { name } = options;
  const project = new Project(tree, name, "library");

  updateJson(
    tree,
    project.path("project.json"),
    (projectJson: ProjectConfiguration) => {
      let { targets } = projectJson;

      if (!targets) {
        targets = {};
      }

      const deployTarget = {
        executor: "@chiubaka/nx-plugin:npm-publish",
        defaultConfiguration: "development",
        dependsOn: [{ target: "build", projects: "self" }],
        options: {
          packagePath: project.distPath(),
        },
        configurations: {
          production: {
            dryRun: false,
          },
          development: {
            dryRun: true,
          },
        },
      };

      targets.deploy = deployTarget as TargetConfiguration<any>;

      projectJson.targets = targets;

      return projectJson;
    },
  );
}
