import {
  ProjectConfiguration,
  TargetConfiguration,
  updateJson,
} from "@nx/devkit";
import path from "node:path";

import { EsLintExecutorOptions, JestExecutorOptions } from "../../../types";
import { Project } from "../../../utils";

export function standardizeProjectJson(project: Project) {
  const tree = project.getTree();
  updateJson(
    tree,
    project.path("project.json"),
    (projectJson: ProjectConfiguration) => {
      const { targets } = projectJson;

      if (!targets) {
        return projectJson;
      }

      const lintTarget = standardizeLintTarget(project, targets.lint);
      if (lintTarget) {
        targets.lint = lintTarget;
      }

      const testTarget = standardizeTestTarget(project, targets.test);
      if (testTarget) {
        targets.test = testTarget;
      }

      return projectJson;
    },
  );
}

function standardizeLintTarget(
  project: Project,
  target?: TargetConfiguration<EsLintExecutorOptions>,
) {
  if (!target || !target.options) {
    return;
  }

  target.options.lintFilePatterns = [project.relativePath()];

  return target;
}

function standardizeTestTarget(
  project: Project,
  target?: TargetConfiguration<JestExecutorOptions>,
) {
  if (!target) {
    return;
  }

  target.outputs = [
    path.join("reports/coverage", project.relativePath()),
    path.join("reports/junit", `${project.getName()}.xml`),
  ];

  return target;
}
