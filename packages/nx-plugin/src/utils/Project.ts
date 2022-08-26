import { getWorkspaceLayout, ProjectType, Tree } from "@nrwl/devkit";
import path from "node:path";

export class Project {
  private tree: Tree;
  private name: string;
  private type: ProjectType;

  constructor(tree: Tree, name: string, type: ProjectType) {
    this.tree = tree;
    this.name = name;
    this.type = type;
  }

  public path(relativePath = "") {
    const { appsDir, libsDir } = getWorkspaceLayout(this.tree);
    const baseDir = this.type === "application" ? appsDir : libsDir;
    return path.join(baseDir, this.name, relativePath);
  }

  public srcPath(relativePath = "") {
    return path.join(this.path("src"), relativePath);
  }

  public testPath(relativePath = "") {
    return path.join(this.path("test"), relativePath);
  }

  public jestConfigPath() {
    return this.path("jest.config.ts");
  }

  public getTree() {
    return this.tree;
  }

  public getScope() {
    const { npmScope } = getWorkspaceLayout(this.tree);
    return npmScope;
  }

  public getName() {
    return this.name;
  }

  public getType() {
    return this.type;
  }
}
