import { Tree } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

import { replaceInFile } from "../../../src";

describe("replaceInFile", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTree();
    tree.write("test.txt", "foo bar baz foo");
  });

  it("replaces all occurrences of the search string with the replace string", () => {
    replaceInFile(tree, "test.txt", "foo", "bat");
    const contents = tree.read("test.txt")?.toString();

    expect(contents).toBe("bat bar baz bat");
  });
});
