import { Tree } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

describe("toHaveRenamedFile", () => {
  let tree: Tree;

  beforeAll(() => {
    tree = createTree();
    tree.write("foobar.txt", "this file is just a bunch of foobar");
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(2).toHaveFileWithContent("foobar.txt", "foobar");
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when the old path still exists", () => {
    expect(() => {
      expect(tree).toHaveRenamedFile("foobar.txt", "new.txt");
    }).toThrow();
  });

  it("fails when the new path doesn't exist", () => {
    expect(() => {
      expect(tree).toHaveRenamedFile("old.txt", "new.txt");
    }).toThrow();
  });

  it("passes when the old path doesn't exist and the new path exists", () => {
    expect(() => {
      expect(tree).toHaveRenamedFile("old.txt", "foobar.txt");
    }).not.toThrow();
  });
});
