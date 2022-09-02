import { Tree } from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/js";

import { Project } from "../../../utils";
import { projectGenerator } from "../../project";
import { LibGeneratorSchema } from "../libGenerator.schema";

export async function tsLibGenerator(tree: Tree, options: LibGeneratorSchema) {
  const { name } = options;

  const project = new Project(tree, name, "library");

  const libraryGeneratorTask = await libraryGenerator(tree, {
    ...options,
    buildable: true,
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
    tsconfig: {
      appLibTypes: [],
      lib: ["es2015"],
      module: "commonjs",
      target: "es2015",
    },
  });

  return async () => {
    await libraryGeneratorTask();
    await projectGeneratorTask();
  };
}
