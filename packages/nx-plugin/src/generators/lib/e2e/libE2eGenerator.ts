import {
  generateFiles,
  ProjectConfiguration,
  Tree,
  updateJson,
} from "@nrwl/devkit";
import { LibE2eGeneratorSchema } from ".";
import { addDependenciesToPackageJson, Project } from "../../../utils";

export async function libE2eGenerator(
  tree: Tree,
  options: LibE2eGeneratorSchema,
) {
  const { libName, name, codeSamplePath } = options;
  const project = new Project(tree, name, "e2e");
  const libProject = new Project(tree, libName, "library");

  const installTask = await addDependenciesToPackageJson(
    tree,
    { [libProject.getImportPath()]: `file:../../${libProject.distPath()}` },
    {},
    project.path("package.json"),
  );

  copyTemplates(codeSamplePath, project, libProject);
  updateProjectJson(project, libName);

  return async () => {
    await installTask();
  };
}

function copyTemplates(
  templatePath: string,
  project: Project,
  libProject: Project,
) {
  const tree = project.getTree();
  const libScope = libProject.getScope();
  const libName = libProject.getName();

  generateFiles(tree, templatePath, project.path(), {
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
