import { generateFiles, moveFilesToNewDirectory, Tree } from "@nx/devkit";
import path from "node:path";

import { Project, replaceInFile } from "../../../utils";
import { reactProjectGenerator } from "../../project";
import { AppGeneratorSchema } from "../appGenerator.schema";
import { reactAppE2eGenerator } from "./e2e";

export async function reactAppGenerator(
  tree: Tree,
  options: AppGeneratorSchema,
) {
  const { name } = options;
  const project = new Project(tree, name, "application");

  const reactProjectTask = await reactProjectGenerator(tree, {
    ...project.getMeta(),
    rootProjectGeneratorName: "app.react",
  });

  updateCodeSample(project);
  updateStorybookConfiguration(project);

  reactAppE2eGenerator(tree, {
    appOrLibName: name,
    name: `${name}-e2e`,
  });

  return async () => {
    await reactProjectTask();
  };
}

/* eslint-disable security/detect-non-literal-fs-filename */
function updateCodeSample(project: Project) {
  const tree = project.getTree();

  tree.rename(
    project.srcPath("app/nx-welcome.tsx"),
    project.srcPath("app/NxWelcome.tsx"),
  );

  replaceInFile(
    tree,
    project.srcPath("app/NxWelcome.tsx"),
    "export function NxWelcome({ title }: { title: string }) {",
    "/**\n * @param {object} props component properties\n * @param {string} props.title the title of the component\n * @returns {Function} a start component with Nx info\n */\nexport function NxWelcome({ title }: { title: string }) {",
  );

  tree.rename(
    project.srcPath("app/nx-welcome.stories.tsx"),
    project.srcPath("app/NxWelcome.stories.tsx"),
  );

  replaceInFile(
    tree,
    project.srcPath("app/NxWelcome.stories.tsx"),
    "./nx-welcome",
    "./NxWelcome",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "./nx-welcome",
    "./NxWelcome",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "// eslint-disable-next-line @typescript-eslint/no-unused-vars\nimport styles from './App.module.scss';\n",
    "",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    '// eslint-disable-next-line @typescript-eslint/no-unused-vars\nimport styles from "./App.module.scss";\n',
    "",
  );
  replaceInFile(
    tree,
    project.srcPath("app/App.tsx"),
    "export function App() {",
    "/**\n * @returns {Function} the main App component\n */\nexport function App() {",
  );
  replaceInFile(tree, project.srcPath("main.tsx"), "./app/App", "./App");
  replaceInFile(
    tree,
    project.srcPath("main.tsx"),
    "import App",
    "import { App }",
  );

  tree.rename(
    project.srcPath("app/App.spec.tsx"),
    project.testPath("unit/App.spec.tsx"),
  );
  replaceInFile(
    tree,
    project.testPath("unit/App.spec.tsx"),
    "import App",
    "import { App }",
  );
  replaceInFile(
    tree,
    project.testPath("unit/App.spec.tsx"),
    "./App",
    "../../src/App",
  );

  moveFilesToNewDirectory(tree, project.srcPath("app"), project.srcPath("App"));
  tree.delete(project.srcPath("app"));

  generateFiles(tree, path.join(__dirname, "files"), project.path(), {
    template: "",
  });
}
/* eslint-enable security/detect-non-literal-fs-filename */

function updateStorybookConfiguration(project: Project) {
  const tree = project.getTree();
  replaceInFile(
    tree,
    project.path(".storybook/main.ts"),
    "../src/app/**/*.stories.mdx",
    "../src/**/*.stories.mdx",
  );
  replaceInFile(
    tree,
    project.path(".storybook/main.ts"),
    "../src/app/**/*.stories.@(js|jsx|ts|tsx)",
    "../src/**/*.stories.@(js|jsx|ts|tsx)",
  );
}
