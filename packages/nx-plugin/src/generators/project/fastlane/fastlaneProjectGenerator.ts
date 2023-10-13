import { generateFiles, Tree } from "@nx/devkit";
import endent from "endent";
import path from "node:path";

import { noOpTask, Project, spawn } from "../../../utils";
import { FastlaneProjectGeneratorSchema } from "./fastlaneProjectGenerator.schema";

export function fastlaneProjectGenerator(
  tree: Tree,
  options: FastlaneProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;

  const project = new Project(tree, projectName, projectType);

  updateGemfile(project);
  copyTemplates(project, options);

  const bundleInstallTask = bundleInstall(project);
  const generateFastlaneReadmeTask = generateFastlaneReadme(project);
  const getAppleDeveloperTeamIdTask = getAppleDeveloperTeamId(project);

  const setupCodeSigningTask = setupCodeSigning(project, options);

  return async () => {
    await bundleInstallTask();
    await generateFastlaneReadmeTask();
    await getAppleDeveloperTeamIdTask();
    await setupCodeSigningTask();
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

function copyTemplates(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  const tree = project.getTree();
  const templateDir = path.join(__dirname, "./files");

  generateFiles(tree, templateDir, project.path(), {
    template: "",
    ...options,
    projectName: project.getNames().pascalCase,
  });

  if (options.skipCodeSigning) {
    tree.delete(project.path("fastlane/Matchfile"));
  }
}

function bundleInstall(project: Project) {
  return async () => {
    await spawn("bundle install", {
      cwd: project.path(),
    });
  };
}

function generateFastlaneReadme(project: Project) {
  return async () => {
    await spawn("bundle exec fastlane docs", {
      cwd: project.path(),
    });
  };
}

function getAppleDeveloperTeamId(project: Project) {
  return async () => {
    await spawn("bundle exec fastlane run set_apple_developer_team_id", {
      cwd: project.path(),
    });
  };
}

function setupCodeSigning(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  if (options.skipCodeSigning) {
    return noOpTask;
  }

  const registerAppWithAppleTask = registerAppWithApple(project, options);
  const generateCertificatesAndProfilesTask =
    generateCertificatesAndProfiles(project);
  const updateSigningSettingsTask = updateSigningSettings(project);

  return async () => {
    await registerAppWithAppleTask();
    await generateCertificatesAndProfilesTask();
    await updateSigningSettingsTask();
  };
}

function registerAppWithApple(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  const { appName, appId, appleId } = options;

  return async () => {
    const command = `bundle exec fastlane produce -u ${appleId} -a ${appId} --app_name "${appName}"`;

    try {
      await spawn(command, {
        cwd: project.path(),
      });
    } catch {
      console.error(
        `Failed to register app with Apple. You may need to run "${command}" manually and troubleshoot.`,
      );
    }
  };
}

function generateCertificatesAndProfiles(project: Project) {
  return async () => {
    await spawn("bundle exec fastlane match development", {
      cwd: project.path(),
    });

    await spawn("bundle exec fastlane match appstore", {
      cwd: project.path(),
    });

    await spawn("bundle exec fastlane match adhoc", {
      cwd: project.path(),
    });
  };
}

function updateSigningSettings(project: Project) {
  return async () => {
    await spawn("bundle exec fastlane run setup_ios_code_signing", {
      cwd: project.path(),
    });
  };
}
