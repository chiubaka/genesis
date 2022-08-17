export const DEFAULT_MOCKED_LATEST_PACKAGE_VERSION = "mocked";
export const DEFAULT_MOCKED_INSTALLED_PACKAGE_VERSION = `^${DEFAULT_MOCKED_LATEST_PACKAGE_VERSION}`;

export const getLatestPackageVersion = () => {
  return Promise.resolve(DEFAULT_MOCKED_LATEST_PACKAGE_VERSION);
};
