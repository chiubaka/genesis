import { Tree, writeJson } from "@nx/devkit";
import { createTree } from "@nx/devkit/testing";

describe("toHavePeerDependency", () => {
  let tree: Tree;

  beforeEach(() => {
    tree = createTree();
  });

  it("fails when given something that isn't an Nx Tree", () => {
    expect(() => {
      expect(2).toHavePeerDependency("jest");
    }).toThrow("Expected value to be an Nx Tree");
  });

  it("fails when package.json doesn't exist", () => {
    expect(() => {
      expect(tree).toHavePeerDependency("jest");
    }).toThrow("Expected /virtual/package.json to exist");
  });

  it("fails when package.json does not have a peerDependencies key", () => {
    writeJson(tree, "package.json", {});

    expect(() => {
      expect(tree).toHavePeerDependency("jest");
    }).toThrow(
      'Expected /virtual/package.json to have a "peerDependencies" key',
    );
  });

  it("fails when the specified peer dependency doesn't exist in package.json", () => {
    writeJson(tree, "package.json", { peerDependencies: {} });

    expect(() => {
      expect(tree).toHavePeerDependency("jest");
    }).toThrow(
      "Expected /virtual/package.json to have jest in peerDependencies",
    );
  });

  it("fails when the specified peer dependency has the wrong version in package.json", () => {
    writeJson(tree, "package.json", { peerDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHavePeerDependency("jest", "1.0.0");
    }).toThrow(
      "Expected /virtual/package.json to have jest@1.0.0 in peerDependencies (received: 1.2.1)",
    );
  });

  it("passes when the specified peer dependency exists in package.json", () => {
    writeJson(tree, "package.json", { peerDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHavePeerDependency("jest");
    }).not.toThrow();
  });

  it("passes when the specified peer dependency and version exists in package.json", () => {
    writeJson(tree, "package.json", { peerDependencies: { jest: "1.2.1" } });

    expect(() => {
      expect(tree).toHavePeerDependency("jest", "1.2.1");
    }).not.toThrow();
  });

  it("respects the packageJsonPath parameter when provided", () => {
    writeJson(tree, "app/package.json", {
      peerDependencies: { jest: "1.2.1" },
    });

    expect(() => {
      expect(tree).toHavePeerDependency("jest", "1.2.1", "app/package.json");
    }).not.toThrow();
  });
});
