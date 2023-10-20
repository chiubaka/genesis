import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface FastlaneProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema,
    FastlaneProjectGeneratorOwnOptions {}

export interface FastlaneProjectGeneratorOwnOptions {
  appId: string;
  appName: string;
  appleId: string;
  appleDeveloperTeamId?: string;
  skipCodeSigning?: boolean;

  iosCodeSigningGitRepositoryUrl: string;
  appStoreConnectKeyIssuerId?: string;
  appStoreConnectKeyId?: string;

  androidUploadKeystoreAlias?: string;
  androidUploadKeystorePassword?: string;
  androidUploadKeystoreCommonName: string;
  androidUploadKeystoreOrganizationalUnit?: string;
  androidUploadKeystoreOrganization: string;
  androidUploadKeystoreLocality?: string;
  androidUploadKeystoreState?: string;
  androidUploadKeystoreCountry: string;
}
