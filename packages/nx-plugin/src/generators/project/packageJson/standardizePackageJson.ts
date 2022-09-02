import { readJson, updateJson } from "@nrwl/devkit";

import { PackageJson } from "../../../types";
import { Project } from "../../../utils";

export const standardizePackageJson = (project: Project) => {
  const tree = project.getTree();

  const rootPackageJson = readJson<PackageJson>(tree, "package.json");
  const rootRepositorySection = rootPackageJson.repository;
  const rootBugsSection = rootPackageJson.bugs;
  const rootHomePage = rootPackageJson.homepage;

  updateJson(tree, project.path("package.json"), (packageJson: PackageJson) => {
    packageJson.license = "UNLICENSED";

    if (rootRepositorySection) {
      packageJson.repository = {
        ...rootRepositorySection,
        directory: project.path(),
      };
    }

    packageJson.bugs = rootBugsSection;

    if (rootHomePage) {
      const githubBaseUrl = rootHomePage.split("#")[0];
      const projectHomePage = `${githubBaseUrl}/blob/master/${project.path(
        "README.md",
      )}`;
      packageJson.homepage = projectHomePage;
    }

    return packageJson;
  });
};
