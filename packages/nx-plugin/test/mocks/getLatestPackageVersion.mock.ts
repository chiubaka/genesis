export const DEFAULT_MOCK_LATEST_PACKAGE_VERSION = "mocked";
export const DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION = `^${DEFAULT_MOCK_LATEST_PACKAGE_VERSION}`;

export const getLatestPackageVersion = () => {
  return Promise.resolve(DEFAULT_MOCK_LATEST_PACKAGE_VERSION);
};
