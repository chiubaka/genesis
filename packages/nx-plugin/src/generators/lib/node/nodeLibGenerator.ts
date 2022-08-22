import { generateFiles, getWorkspaceLayout, Tree } from "@nrwl/devkit";
import { libraryGenerator } from "@nrwl/js";
import path from "node:path";

import { projectNameCasings } from "../../../utils";
import { NodeLibGeneratorSchema } from "./nodeLibGenerator.schema";

export async function nodeLibGenerator(
  tree: Tree,
  options: NodeLibGeneratorSchema,
) {
  await libraryGenerator(tree, {
    ...options,
    importPath: `@${options.scope}/${options.name}`,
    pascalCaseFiles: true,
    strict: true,
    buildable: true,
  });

  const { libsDir } = getWorkspaceLayout(tree);

  const projectName = projectNameCasings(options.name);

  const projectDir = path.join(libsDir, projectName.kebabCase);
  const srcDir = path.join(projectDir, "./src");

  tree.delete(srcDir);
  generateFiles(tree, path.join(__dirname, "./files"), projectDir, {
    template: "",
    projectName,
  });
}
