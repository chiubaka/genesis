import PackageJson from "../../../package.json";

export const NX_VERSION = PackageJson["devDependencies"]["nx"];

export const compatiblePackageVersions: Record<string, string> = {
  "@chiubaka/eslint-config": "^0.6.3",
  "@nrwl/cli": NX_VERSION,
  "@nrwl/eslint-plugin-nx": NX_VERSION,
  "@nrwl/jest": NX_VERSION,
  "@nrwl/js": NX_VERSION,
  "@nrwl/node": NX_VERSION,
  "@nrwl/workspace": NX_VERSION,
  jest: "^28.1.3",
  "jest-environment-jsdom": "^28.1.3",
  nx: NX_VERSION,
  prettier: "^2.8.8",
  "ts-jest": "^28.0.8",
  typescript: "^5.2.0",
};
