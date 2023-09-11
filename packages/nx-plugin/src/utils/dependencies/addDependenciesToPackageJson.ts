import {
  addDependenciesToPackageJson as nxAddDependenciesToPackageJson,
  Tree,
} from "@nx/devkit";

import { compatiblePackageVersions } from "./compatiblePackageVersions";
import { getLatestPackageVersion } from "./getLatestPackageVersion";

type Dependencies = string[] | DependenciesWithVersions;
type DependenciesWithVersions = Record<string, string | undefined>;

export const addDependenciesToPackageJson = async (
  tree: Tree,
  dependencies: Dependencies,
  devDependencies: Dependencies,
  packageJsonPath?: string,
) => {
  const dependenciesWithVersions = await calculateDependencyVersions(
    dependencies,
  );
  const devDependenciesWithVersions = await calculateDependencyVersions(
    devDependencies,
  );

  return nxAddDependenciesToPackageJson(
    tree,
    dependenciesWithVersions,
    devDependenciesWithVersions,
    packageJsonPath,
  );
};

const calculateDependencyVersions = async (
  dependencies: Dependencies,
): Promise<Record<string, string>> => {
  const dependenciesWithVersions: Record<string, string> = {};

  if (isDependencyArray(dependencies)) {
    for (const dependencyName of dependencies) {
      const version = await calculateDependencyVersion(dependencyName);
      // eslint-disable-next-line security/detect-object-injection
      dependenciesWithVersions[dependencyName] = version;
    }
  } else {
    for (const dependencyName in dependencies) {
      const version =
        // eslint-disable-next-line security/detect-object-injection
        dependencies[dependencyName] ||
        (await calculateDependencyVersion(dependencyName));
      // eslint-disable-next-line security/detect-object-injection
      dependenciesWithVersions[dependencyName] = version;
    }
  }

  return dependenciesWithVersions;
};

const isDependencyArray = (
  dependencies: Dependencies,
): dependencies is string[] => {
  return Array.isArray(dependencies);
};

const calculateDependencyVersion = async (dependencyName: string) => {
  // eslint-disable-next-line security/detect-object-injection
  const compatibleVersion = compatiblePackageVersions[dependencyName];

  if (compatibleVersion) {
    return compatibleVersion;
  }

  const latestVersion = await getLatestPackageVersion(dependencyName);

  return `^${latestVersion}`;
};
