import { generateFiles, Tree } from "@nx/devkit";
import endent from "endent";
import path from "node:path";

import { Project, spawn } from "../../../utils";
import { FastlaneProjectGeneratorSchema } from "./fastlaneProjectGenerator.schema";

export function fastlaneProjectGenerator(
  tree: Tree,
  options: FastlaneProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;

  const project = new Project(tree, projectName, projectType);

  updateGemfile(project);
  copyFastlaneFiles(project, options);

  const bundleInstallTask = bundleInstall(project);

  return async () => {
    await bundleInstallTask();
  };
}

function updateGemfile(project: Project) {
  const tree = project.getTree();

  const gemfilePath = project.path("Gemfile");

  let gemfileContents = tree.read(gemfilePath)?.toString().trim();

  if (!gemfileContents) {
    throw new Error(
      `Unexpectedly encountered empty or missing Gemfile at ${gemfilePath}`,
    );
  }

  gemfileContents = endent`
    ${gemfileContents}
    gem "fastlane"

    plugins_path = File.join(File.dirname(__FILE__), "fastlane", "Pluginfile")
    eval_gemfile(plugins_path) if File.exist?(plugins_path)
  `;

  tree.write(gemfilePath, gemfileContents);
}

function copyFastlaneFiles(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  const tree = project.getTree();
  const templateDir = path.join(__dirname, "./files");

  generateFiles(tree, templateDir, project.path(), {
    template: "",
    ...options,
  });
}

function bundleInstall(project: Project) {
  return async () => {
    await spawn("bundle install", {
      cwd: project.path(),
    });
  };
}
