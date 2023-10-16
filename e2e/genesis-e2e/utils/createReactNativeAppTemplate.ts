import { copyWorkspaceTemplate } from "./copyWorkspaceTemplate";

export async function createReactNativeAppTemplate(workspaceName: string) {
  const workspace = await copyWorkspaceTemplate(workspaceName);

  await workspace.execNx(
    'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --appName="Genesis React Native App" --appId="com.chiubaka.genesis.example.ReactNativeApp" --appleId="daniel@chiubaka.com" --androidEmulatorAvdName="Detox" --iosCodeSigningGitRepositoryUrl="git@github.com:chiubaka/ios-codesigning.git" --androidUploadKeystoreCommonName="Genesis" --androidUploadKeystoreOrganization="Chiubaka Technologies LLC" --androidUploadKeystoreCountry="US"',
  );

  return workspace;
}
