export interface NpmPublishExecutorSchema {
  access: "restricted" | "public";
  dryRun: boolean;
  registryCredentials?: RegistryCredentials;
  registryUrl: string;

  packagePath: string;

  skipLogin: boolean;
  skipUnpublish: boolean;
}

export interface RegistryCredentials {
  username: string;
  password: string;
  email: string;
}
