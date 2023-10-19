import { generateFiles, Tree } from "@nx/devkit";
import endent from "endent";
import path from "node:path";

import { PasswordGenerator } from "../../../types";
import { noOpTask, Project, replaceInFile, spawn } from "../../../utils";
import { FastlaneProjectGeneratorSchema } from "./fastlaneProjectGenerator.schema";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const passwordGenerator = require("generate-password") as PasswordGenerator;

export function fastlaneProjectGenerator(
  tree: Tree,
  options: FastlaneProjectGeneratorSchema,
) {
  const { projectName, projectType } = options;

  const project = new Project(tree, projectName, projectType);

  updateGemfile(project);
  copyTemplates(project, options);

  const bundleInstallTask = bundleInstall(project);
  const addLinuxCiPlatformTask = addLinuxCiPlatform(project);
  const generateFastlaneReadmeTask = generateFastlaneReadme(project);
  const getAppleDeveloperTeamIdTask = saveAppleDeveloperTeamId(project);

  const setupCodeSigningTask = setupCodeSigning(project, options);

  return async () => {
    await bundleInstallTask();
    await addLinuxCiPlatformTask();
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
    gem "dotenv"
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

/**
 * On CI, Android tasks will run on a different architecture.
 * To enable this, this architecture needs to be added to Gemfile.lock
 * @param project the project to generate in
 * @returns a task that installs the x86_64-linux architecture into Gemfile.lock
 */
function addLinuxCiPlatform(project: Project) {
  return async () => {
    await spawn("bundle lock --add-platform x86_64-linux", {
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

function saveAppleDeveloperTeamId(project: Project) {
  return async () => {
    await spawn("bundle exec fastlane run save_apple_developer_team_id", {
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

  const setupIosCodeSigningTask = setupIosCodeSigning(project);
  const setupAndroidCodeSigningTask = setupAndroidCodeSigning(project, options);

  return async () => {
    await setupIosCodeSigningTask();
    await setupAndroidCodeSigningTask();
  };
}

function setupIosCodeSigning(project: Project) {
  const registerAppWithAppleTask = registerAppWithApple(project);
  const generateCertificatesAndProfilesTask =
    generateCertificatesAndProfiles(project);
  const updateSigningSettingsTask = updateSigningSettings(project);

  return async () => {
    await registerAppWithAppleTask();
    await generateCertificatesAndProfilesTask();
    await updateSigningSettingsTask();
  };
}

function setupAndroidCodeSigning(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  updateGradleProject(project);
  const generateUploadKeystoreTask = generateUploadKeystore(project, options);

  return async () => {
    await generateUploadKeystoreTask();
  };
}

function registerAppWithApple(project: Project) {
  return async () => {
    const command = `bundle exec fastlane run register_app_with_apple"`;

    try {
      await spawn(command, {
        cwd: project.path(),
        // This command sometimes triggers the need to manually re-auth
        // and will hang when this occurs. Timeout helps to prevent us
        // from waiting too long in this case.
        // https://docs.fastlane.tools/getting-started/ios/authentication/
        timeout: process.env.NODE_ENV === "test" ? 30_000 : undefined,
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

function updateGradleProject(project: Project) {
  const tree = project.getTree();
  const gradlePath = project.path("android/app/build.gradle");

  replaceInFile(
    tree,
    gradlePath,
    "android {",
    endent`
      /**
       * Load the signing keystore from a file
       */
      def keyStorePropertiesFile = rootProject.file('secrets/upload-keystore.properties')
      def keyStoreProperties = new Properties()
      keyStoreProperties.load(new FileInputStream(keyStorePropertiesFile))

      android {
    `,
  );

  replaceInFile(
    tree,
    gradlePath,
    "debug {\n            storeFile file('debug.keystore')\n            storePassword 'android'\n            keyAlias 'androiddebugkey'\n            keyPassword 'android'\n        }\n",
    "debug {\n            storeFile file('debug.keystore')\n            storePassword 'android'\n            keyAlias 'androiddebugkey'\n            keyPassword 'android'\n        }\n        release {\n            keyAlias keyStoreProperties['releaseKeyAlias']\n            keyPassword keyStoreProperties['releaseKeyPassword']\n            storeFile file(rootProject.file('secrets/upload-keystore.jks'))\n            storePassword keyStoreProperties['releaseStorePassword']\n        }\n",
  );

  replaceInFile(
    tree,
    gradlePath,
    "release {\n            // Caution! In production, you need to generate your own keystore file.\n            // see https://reactnative.dev/docs/signed-apk-android.\n            signingConfig signingConfigs.debug\n",
    "release {\n            signingConfig signingConfigs.release\n",
  );
}

function generateUploadKeystore(
  project: Project,
  options: FastlaneProjectGeneratorSchema,
) {
  const {
    appId,

    androidUploadKeystoreAlias,
    androidUploadKeystorePassword,
    androidUploadKeystoreCommonName: commonName,
    androidUploadKeystoreOrganizationalUnit,
    androidUploadKeystoreOrganization: organization,
    androidUploadKeystoreLocality,
    androidUploadKeystoreState,
    androidUploadKeystoreCountry: country,
  } = options;

  const alias = androidUploadKeystoreAlias ?? appId;
  const password =
    androidUploadKeystorePassword ??
    passwordGenerator.generate({
      length: 50,
      numbers: true,
    });

  writeUploadKeystoreProperties(project, alias, password);

  const organizationalUnit =
    androidUploadKeystoreOrganizationalUnit ?? "Unknown";
  const locality = androidUploadKeystoreLocality ?? "Unknown";
  const state = androidUploadKeystoreState ?? "Unknown";

  const distinguishedName = `CN=${commonName}, OU=${organizationalUnit}, O=${organization}, L=${locality}, ST=${state}, C=${country}`;

  return async () => {
    await spawn(
      `echo y | keytool -genkey -v -keyalg RSA -keysize 4096 -dname "${distinguishedName}" -alias ${alias} -keypass ${password} -keystore android/secrets/upload-keystore.jks -storepass ${password} -validity 20000`,
      {
        cwd: project.path(),
      },
    );
  };
}

function writeUploadKeystoreProperties(
  project: Project,
  alias: string,
  password: string,
) {
  project.write(
    "android/secrets/upload-keystore.properties",
    endent`
      releaseKeyAlias=${alias}
      releaseKeyPassword=${password}
      # KeyPassword and StorePassword are intentionally the same (https://developer.android.com/studio/known-issues#ki-key-keystore-warning)
      releaseStorePassword=${password}
    `,
  );
}
