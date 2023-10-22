import PackageJson from "../../../package.json";

export const NX_VERSION = PackageJson["devDependencies"]["nx"];

export const compatiblePackageVersions: Record<string, string> = {
  "@chiubaka/eslint-config": "^0.6.3",
  "@nrwl/cli": NX_VERSION,
  "@nx/eslint-plugin": NX_VERSION,
  "@nx/jest": NX_VERSION,
  "@nx/js": NX_VERSION,
  "@nrwl/node": NX_VERSION,
  "@nx/workspace": NX_VERSION,
  // An incompatibility observed in lint-staged 15.0.x causes initial commit of the workspace to fail
  "lint-staged": "^14.0.1",
  jest: "^29.4.3",
  "jest-environment-jsdom": "^29.4.3",
  nx: NX_VERSION,
  prettier: "^2.8.8",
  "ts-jest": "^29.0.5",
  typescript: "^4.9.5",
};
