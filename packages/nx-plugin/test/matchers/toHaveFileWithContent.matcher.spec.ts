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

  describe("when reading the file returns a null buffer", () => {
    let readSpy: jest.SpyInstance;

    beforeAll(() => {
      readSpy = jest.spyOn(tree, "read").mockImplementation(() => {
        // eslint-disable-next-line unicorn/no-null
        return null;
      });
    });

    afterAll(() => {
      readSpy.mockRestore();
    });

    it("fails", () => {
      expect(() => {
        expect(tree).toHaveFileWithContent(
          "foobar.txt",
          "this file is just a bunch of foobar",
        );
      }).toThrow(
        "Unexpectedly received null when attempting to read foobar.txt",
      );
    });
  });

  describe("when negated", () => {
    it("passes when the tree does not have the specified file", () => {
      expect(() => {
        expect(tree).not.toHaveFileWithContent("bar.txt", "bar");
      }).not.toThrow();
    });

    it("passes when the tree has the specified file, but the file does not contain the specified content", () => {
      expect(() => {
        expect(tree).not.toHaveFileWithContent("foobar.txt", "Hello, world!");
      }).not.toThrow();
    });

    it("fails when the tree has the specified file with the specified content", () => {
      expect(() => {
        expect(tree).not.toHaveFileWithContent("foobar.txt", "foobar");
      }).toThrow();
    });

    describe("when exact=true", () => {
      it("passes when the tree has the specified file, but the file's contents do not exactly match the specified content", () => {
        expect(() => {
          expect(tree).not.toHaveFileWithContent("foobar.txt", "foobar", {
            exact: true,
          });
        }).not.toThrow();
      });

      it("fails when the tree has the specified file and the file's contents exactly match the specified content", () => {
        expect(() => {
          expect(tree).not.toHaveFileWithContent(
            "foobar.txt",
            "this file is just a bunch of foobar",
          );
        }).toThrow();
      });
    });
  });
});
