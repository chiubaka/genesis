import { Project, replaceInFile } from "../../../utils";

export function updateProjectJsonReferences(
  project: Project,
  originalProjectDir: string,
) {
  const tree = project.getTree();
  replaceInFile(
    tree,
    project.path("project.json"),
    originalProjectDir,
    project.relativePath(),
  );
}
