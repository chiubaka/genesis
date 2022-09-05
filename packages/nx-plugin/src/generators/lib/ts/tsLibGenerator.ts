import { Tree } from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/js";

import { noOpTask, Project } from "../../../utils";
import {
  addNpmPublishDeployScriptsToPackageJson,
  copyTsLibSample,
  projectGenerator,
} from "../../project";
import { LibGeneratorSchema } from "../libGenerator.schema";
import { tsLibE2eGenerator } from "./e2e";

export async function tsLibGenerator(tree: Tree, options: LibGeneratorSchema) {
  const { name } = options;

  const project = new Project(tree, name, "library");

  const libraryGeneratorTask = await libraryGenerator(tree, {
    ...options,
    buildable: true,
    config: "project",
    importPath: project.getImportPath(),
    includeBabelRc: false,
    publishable: true,
    strict: true,
    testEnvironment: "node",
  });

  const projectGeneratorTask = await projectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "lib.ts",
    jest: {
      testEnvironment: "node",
    },
    pruneSrcSubdirectories: true,
    tsconfig: {
      appLibTypes: [],
      lib: ["es2015"],
      module: "commonjs",
      target: "es2015",
    },
  });

  addNpmPublishDeployScriptsToPackageJson(project);
  copyTsLibSample(project);

  const e2eProjectTask = await generateE2eProject(project, options);

  return async () => {
    await libraryGeneratorTask();
    await projectGeneratorTask();
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

  return tsLibE2eGenerator(tree, {
    name: `${projectName}-e2e`,
    appOrLibName: projectName,
    rootProjectGeneratorName: "lib.ts",
  });
}
