import { getWorkspaceLayout, ProjectType, Tree } from "@nrwl/devkit";
import path from "node:path";

export const getProjectDir = (
  tree: Tree,
  projectName: string,
  projectType: ProjectType,
) => {
  const { appsDir, libsDir } = getWorkspaceLayout(tree);
  const baseDir = projectType === "application" ? appsDir : libsDir;

  return path.join(baseDir, projectName);
};
