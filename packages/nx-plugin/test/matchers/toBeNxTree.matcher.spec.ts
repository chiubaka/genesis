import { Tree } from "@nrwl/devkit";
import { createTree } from "@nrwl/devkit/testing";

describe("toBeNxTree", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("passes on a real Nx Tree", () => {
    expect(() => {
      expect(tree).toBeNxTree();
    }).not.toThrow();
  });

  it("fails on an object missing the `root` property", () => {
    delete tree.root;

    expect(() => {
      expect(tree).toBeNxTree();
    }).toThrow(
      "Expected value to be an Nx Tree: Expected value to have a root property",
    );
  });

  it("fails on an object missing the `read` function", () => {
    tree.read = undefined;

    expect(() => {
      expect(tree).toBeNxTree();
    }).toThrow(
      "Expected value to be an Nx Tree: Expected value to have a read key",
    );
  });

  it("fails on something totally unrelated to an Nx Tree", () => {
    expect(() => {
      expect(2).toBeNxTree();
    }).toThrow(
      "Expected value to be an Nx Tree: Expected value to have a root property",
    );
  });
});
