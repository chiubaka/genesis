import { readJson, Tree } from "@nx/devkit";
import path from "node:path";
import { PackageJson } from "nx/src/utils/package-json";

export const toHaveDependencies = (
  tree: Tree,
  expectedDependencies: Record<string, string | undefined>,
  packageJsonPath = "package.json",
  dependenciesKey:
    | "dependencies"
    | "devDependencies"
    | "peerDependencies" = "dependencies",
): jest.CustomMatcherResult => {
  expect(tree).toBeNxTree();

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  packageJsonPath = tree.exists(packageJsonPath)
    ? packageJsonPath
    : // Fall back on the workspace root package.json, if no package.json is found
      // at the supplied path
      "package.json";

  const fullPath = path.join(tree.root, packageJsonPath);

  // eslint-disable-next-line security/detect-non-literal-fs-filename
  if (!tree.exists(packageJsonPath)) {
    return {
      pass: false,
      message: () => {
        return `Expected ${fullPath} to exist`;
      },
    };
  }

  const packageJson = readJson<PackageJson>(tree, packageJsonPath);

  // eslint-disable-next-line security/detect-object-injection
  const dependencies = packageJson[dependenciesKey];

  if (dependencies === undefined) {
    return {
      pass: false,
      message: () => {
        return `Expected ${fullPath} to have a "${dependenciesKey}" key`;
      },
    };
  }

  for (const dependencyName in expectedDependencies) {
    // eslint-disable-next-line security/detect-object-injection
    const expectedVersion = expectedDependencies[dependencyName];

    const isMissingDependency =
      // eslint-disable-next-line security/detect-object-injection
      !expectedVersion && !dependencies[dependencyName];
    const isMissingDependencyWithVersion =
      // eslint-disable-next-line security/detect-object-injection
      expectedVersion && dependencies[dependencyName] !== expectedVersion;

    if (isMissingDependency) {
      return {
        pass: false,
        message: () => {
          return `Expected ${fullPath} to have ${dependencyName} in ${dependenciesKey}`;
        },
      };
    } else if (isMissingDependencyWithVersion) {
      // eslint-disable-next-line security/detect-object-injection
      const version = dependencies[dependencyName];
      return {
        pass: false,
        message: () => {
          return `Expected ${fullPath} to have ${dependencyName}@${expectedVersion} in ${dependenciesKey} (received: ${version})`;
        },
      };
    }
  }

  return {
    pass: true,
    message: () => {
      return `Expected ${fullPath} to have matching ${dependenciesKey}:\n\n${JSON.stringify(
        expectedDependencies,
        undefined,
        2,
      )}`;
    },
  };
};
