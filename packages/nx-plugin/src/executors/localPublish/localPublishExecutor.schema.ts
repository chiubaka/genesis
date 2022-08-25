export interface LocalPublishExecutorSchema {
  registryCredentials: RegistryCredentials;
  registryUrl: string;

  packagePath: string;
}

export interface RegistryCredentials {
  username: string;
  password: string;
  email: string;
}
