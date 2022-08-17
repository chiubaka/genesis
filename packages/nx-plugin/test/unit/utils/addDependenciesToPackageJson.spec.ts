import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { addDependenciesToPackageJson } from "../../../src";
import { DEFAULT_MOCKED_INSTALLED_PACKAGE_VERSION } from "../../mocks";

describe("addDependenciesToPackageJson", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await addDependenciesToPackageJson(
      tree,
      { "@chiubaka/nx-plugin": "0.0.2", tslib: undefined },
      ["typescript", "prettier"],
    );
  });

  it("keeps supplied versions", () => {
    expect(tree).toHaveDependency("@chiubaka/nx-plugin", "0.0.2");
  });

  it("provides versions for packages that were listed as having undefined versions", () => {
    expect(tree).toHaveDependency(
      "tslib",
      DEFAULT_MOCKED_INSTALLED_PACKAGE_VERSION,
    );
  });

  it("provides versions for dependencies listed in an array", () => {
    expect(tree).toHaveDevDependency(
      "typescript",
      DEFAULT_MOCKED_INSTALLED_PACKAGE_VERSION,
    );
    expect(tree).toHaveDevDependency(
      "prettier",
      DEFAULT_MOCKED_INSTALLED_PACKAGE_VERSION,
    );
  });
});
