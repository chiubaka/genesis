import { Tree, writeJson } from "@nrwl/devkit";
import { createTree } from "@nrwl/devkit/testing";

describe("toHaveDependencies", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(4).toHaveDependencies({ jest: undefined });
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHaveDependencies({ jest: undefined });
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json doesn't have a dependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHaveDependencies({ jest: undefined });
    }).toThrow('Expected /virtual/package.json to have a "dependencies" key');
  });

  it("fails when package.json does not have the specified dependency", () => {
    writeJson(tree, "package.json", { dependencies: {} });

    expect(() => {
      expect(tree).toHaveDependencies({ jest: undefined });
    }).toThrow("Expected /virtual/package.json to have jest in dependencies");
  });

  it("fails when package.json has a dependency with the wrong version", () => {
    writeJson(tree, "package.json", { dependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHaveDependencies({ jest: "1.2.1" });
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.2.1 in dependencies (received: 1.0.0)",
    );
  });

  it("fails when package.json has some of the specified dependencies, but not all of them", () => {
    writeJson(tree, "package.json", { dependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHaveDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript in dependencies",
    );
  });

  it("fails when package.json has some matching dependency versions, but not all of them", () => {
    writeJson(tree, "package.json", {
      dependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDependencies({
        jest: "1.0.0",
        typescript: "5.2.1",
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript@5.2.1 in dependencies (received: 4.7.4)",
    );
  });

  it("passes when package.json has all specified dependencies", () => {
    writeJson(tree, "package.json", {
      dependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified dependencies and versions", () => {
    writeJson(tree, "package.json", {
      dependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDependencies({
        jest: "1.0.0",
        typescript: "4.7.4",
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified dependencies and versions (mixed with no version specification)", () => {
    writeJson(tree, "package.json", {
      dependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDependencies({
        jest: "1.0.0",
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", {
      dependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHaveDependencies(
        {
          jest: "1.0.0",
          typescript: undefined,
        },
        "app/package.json",
      );
    }).not.toThrow();
  });
});
