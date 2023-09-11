import { generateFiles, moveFilesToNewDirectory, Tree } from "@nx/devkit";
import path from "path";
import { Project, replaceInFile } from "../../../../utils";
import { eslintProjectGenerator } from "../../../project";
import { E2eGeneratorBaseSchema } from "../../../e2eGeneratorBase.schema";

export function reactAppE2eGenerator(
  tree: Tree,
  options: E2eGeneratorBaseSchema,
) {
  const { appOrLibName, name } = options;
  const project = new Project(tree, name, "e2e");
  const appProject = new Project(tree, appOrLibName, "application");

  generateFiles(tree, path.join(__dirname, "files"), project.path(), {
    template: "",
  });

  eslintProjectGenerator(tree, project.getMeta());

  replaceInFile(
    tree,
    project.srcPath("e2e/App/App.cy.ts"),
    "Welcome to App!",
    `Welcome ${appProject.getName()}`,
  );
  replaceInFile(
    tree,
    project.srcPath("e2e/nx-welcome/nx-welcome.cy.ts"),
    "Welcome to NxWelcome!",
    `Welcome ${appProject.getName()}`,
  );

  tree.rename(
    project.srcPath("e2e/app.cy.ts"),
    project.srcPath("e2e/App.cy.ts"),
  );

  moveFilesToNewDirectory(
    tree,
    project.srcPath("e2e/nx-welcome"),
    project.srcPath("e2e/NxWelcome"),
  );
  tree.delete(project.srcPath("e2e/nx-welcome"));
  tree.rename(
    project.srcPath("e2e/NxWelcome/nx-welcome.cy.ts"),
    project.srcPath("e2e/NxWelcome/NxWelcome.cy.ts"),
  );
}
