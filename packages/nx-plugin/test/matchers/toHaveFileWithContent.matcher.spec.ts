import { Tree } from "@nrwl/devkit";
import { createTree } from "@nrwl/devkit/testing";

describe("toHaveFileWithContent", () => {
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

  it("fails if the given file doesn't exist in the tree", () => {
    expect(() => {
      expect(tree).toHaveFileWithContent("missing.txt", "???");
    }).toThrow();
  });

  it("fails if the given text doesn't appear within the given file", () => {
    expect(() => {
      expect(tree).toHaveFileWithContent("foobar.txt", "hello, world!");
    }).toThrow();
  });

  it("passes if the given text appears within the given file", () => {
    expect(() => {
      expect(tree).toHaveFileWithContent("foobar.txt", "foobar");
    }).not.toThrow();
  });

  describe("with exact=true", () => {
    it("fails if the given text appears within the given file, but isn't entire content", () => {
      expect(() => {
        expect(tree).toHaveFileWithContent("foobar.txt", "foobar", {
          exact: true,
        });
      }).toThrow();
    });

    it("passes if the given text exactly matches the content within the given file", () => {
      expect(() => {
        expect(tree).toHaveFileWithContent(
          "foobar.txt",
          "this file is just a bunch of foobar",
          { exact: true },
        );
      }).not.toThrow();
    });
  });
});
