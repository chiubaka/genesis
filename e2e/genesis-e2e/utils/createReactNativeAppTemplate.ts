import { copyWorkspaceTemplate } from "./copyWorkspaceTemplate";

export async function createReactNativeAppTemplate(workspaceName: string) {
  const workspace = await copyWorkspaceTemplate(workspaceName);

  await workspace.execNx(
    'generate @chiubaka/nx-plugin:app.react-native --name=react-native-app --appName="Genesis React Native App" --appId="com.chiubaka.genesis.example.ReactNativeApp" --appleId="daniel@chiubaka.com" --appleDeveloperTeamId="AYCA644992" --androidEmulatorAvdName="Detox" --iosCodeSigningGitRepositoryUrl="git@github.com:chiubaka/ios-code-signing.git" --appStoreConnectKeyIssuerId="1ced7937-7d1e-4874-9bc9-823c1825148f" --appStoreConnectKeyId="43YKVHYVJQ" --androidUploadKeystoreCommonName="Genesis" --androidUploadKeystoreOrganization="Chiubaka Technologies LLC" --androidUploadKeystoreCountry="US"',
  );

  return workspace;
}
