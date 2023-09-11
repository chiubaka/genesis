import { Tree, writeJson } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

describe("toHavePeerDependencies", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(4).toHavePeerDependencies({ jest: undefined });
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHavePeerDependencies({ jest: undefined });
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json doesn't have a peerDependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHavePeerDependencies({ jest: undefined });
    }).toThrow(
      'Expected /virtual/package.json to have a "peerDependencies" key',
    );
  });

  it("fails when package.json does not have the specified peerDependency", () => {
    writeJson(tree, "package.json", { peerDependencies: {} });

    expect(() => {
      expect(tree).toHavePeerDependencies({ jest: undefined });
    }).toThrow(
      "Expected /virtual/package.json to have jest in peerDependencies",
    );
  });

  it("fails when package.json has a peerDependency with the wrong version", () => {
    writeJson(tree, "package.json", { peerDependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHavePeerDependencies({ jest: "1.2.1" });
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.2.1 in peerDependencies (received: 1.0.0)",
    );
  });

  it("fails when package.json has some of the specified peerDependencies, but not all of them", () => {
    writeJson(tree, "package.json", { peerDependencies: { jest: "1.0.0" } });

    expect(() => {
      expect(tree).toHavePeerDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript in peerDependencies",
    );
  });

  it("fails when package.json has some matching dependency versions, but not all of them", () => {
    writeJson(tree, "package.json", {
      peerDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHavePeerDependencies({
        jest: "1.0.0",
        typescript: "5.2.1",
      });
    }).toThrow(
      "Expected /virtual/package.json to have typescript@5.2.1 in peerDependencies (received: 4.7.4)",
    );
  });

  it("passes when package.json has all specified peerDependencies", () => {
    writeJson(tree, "package.json", {
      peerDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHavePeerDependencies({
        jest: undefined,
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified peerDependencies and versions", () => {
    writeJson(tree, "package.json", {
      peerDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHavePeerDependencies({
        jest: "1.0.0",
        typescript: "4.7.4",
      });
    }).not.toThrow();
  });

  it("passes when package.json has all specified peerDependencies and versions (mixed with no version specification)", () => {
    writeJson(tree, "package.json", {
      peerDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHavePeerDependencies({
        jest: "1.0.0",
        typescript: undefined,
      });
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", {
      peerDependencies: { jest: "1.0.0", typescript: "4.7.4" },
    });

    expect(() => {
      expect(tree).toHavePeerDependencies(
        {
          jest: "1.0.0",
          typescript: undefined,
        },
        "app/package.json",
      );
    }).not.toThrow();
  });
});
