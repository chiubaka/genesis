import {
  addDependenciesToPackageJson as nxAddDependenciesToPackageJson,
  Tree,
} from "@nrwl/devkit";

import { getLatestPackageVersion } from "./getLatestPackageVersion";

type Dependencies = string[] | DependenciesWithVersions;
type DependenciesWithVersions = Record<string, string | undefined>;

export const addDependenciesToPackageJson = async (
  tree: Tree,
  dependencies: Dependencies,
  devDependencies: Dependencies,
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
  );
};

const calculateDependencyVersions = async (
  dependencies: Dependencies,
): Promise<Record<string, string>> => {
  const dependenciesWithVersions: Record<string, string> = {};

  if (isDependencyArray(dependencies)) {
    for (const dependencyName of dependencies) {
      const version = await getLatestPackageVersion(dependencyName);
      // eslint-disable-next-line security/detect-object-injection
      dependenciesWithVersions[dependencyName] = version;
    }
  } else {
    for (const dependencyName in dependencies) {
      const version =
        // eslint-disable-next-line security/detect-object-injection
        dependencies[dependencyName] ||
        (await getLatestPackageVersion(dependencyName));
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
