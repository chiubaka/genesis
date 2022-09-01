import { Project } from "../../../utils";

export function updateProjectJsonReferences(
  project: Project,
  originalProjectDir: string,
) {
  const tree = project.getTree();
  let projectJson = tree.read(project.path("project.json"))?.toString();

  if (projectJson) {
    projectJson = projectJson?.replace(
      // eslint-disable-next-line security/detect-non-literal-regexp
      new RegExp(originalProjectDir, "g"),
      project.relativePath(),
    );
    tree.write(project.path("project.json"), projectJson);
  }
}
