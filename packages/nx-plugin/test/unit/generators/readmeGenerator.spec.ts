import { Tree } from "@nrwl/devkit";
import { createTreeWithEmptyWorkspace } from "@nrwl/devkit/testing";

import { readmeGenerator } from "../../../src/generators";

describe("readmeGenerator", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTreeWithEmptyWorkspace();
    readmeGenerator(tree, {
      workspaceName: "genesis",
      workspaceScope: "chiubaka",
    });
  });

  it("creates a README.md file", () => {
    expect(tree.exists("README.md")).toBe(true);
  });

  describe("README.md", () => {
    it("fills in the workspace name as the title", () => {
      expect(tree).toHaveFileWithContent("README.md", "# genesis");
    });

    it("includes a CircleCI shield", () => {
      expect(tree).toHaveFileWithContent(
        "README.md",
        "[![circleci](https://circleci.com/gh/chiubaka/genesis.svg?style=shield)](https://app.circleci.com/pipelines/github/chiubaka/genesis?filter=all)",
      );
    });

    it("includes a Codecov shield", () => {
      expect(tree).toHaveFileWithContent(
        "README.md",
        "[![codecov](https://codecov.io/gh/chiubaka/genesis/branch/master/graph/badge.svg?token=RV9CfKz4GB)](https://codecov.io/gh/chiubaka/genesis)",
      );
    });

    it("includes manual setup instructions", () => {
      expect(tree).toHaveFileWithContent("README.md", "## Manual Setup");
    });
  });
});
