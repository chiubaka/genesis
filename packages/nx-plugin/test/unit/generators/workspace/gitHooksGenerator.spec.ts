import { readJson, Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";
import { PackageJson } from "nx/src/utils/package-json";

import { gitHooksGenerator } from "../../../../src/generators";
import { DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION } from "../../../mocks";

describe("gitHooksGenerator", () => {
  let tree: Tree;

  beforeAll(async () => {
    tree = createTreeWithEmptyWorkspace();
    await gitHooksGenerator(tree, {
      preCommitCommand: "yarn run lint:staged",
      prePushCommand: "nx affected --target=test",
    });
  });

  it("adds husky as a devDependency", () => {
    expect(tree).toHaveDevDependency(
      "husky",
      DEFAULT_MOCK_INSTALLED_PACKAGE_VERSION,
    );
  });

  it("adds a prepare script to install husky", () => {
    const json = readJson<PackageJson>(tree, "package.json");

    expect(json.scripts?.prepare).toBe("husky install");
  });
});
