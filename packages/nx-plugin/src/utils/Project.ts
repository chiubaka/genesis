import { getWorkspaceLayout, names, ProjectType, Tree } from "@nrwl/devkit";
import path from "node:path";

export interface ProjectNames {
  camelCase: string;
  kebabCase: string;
  pascalCase: string;
}

export class Project {
  private tree: Tree;
  private names: ProjectNames;
  private type: ProjectType;

  constructor(tree: Tree, name: string, type: ProjectType) {
    this.tree = tree;
    this.type = type;

    const {
      className: pascalCase,
      fileName: kebabCase,
      propertyName: camelCase,
    } = names(name);

    this.names = {
      camelCase,
      kebabCase,
      pascalCase,
    };
  }

  public path(relativePath = "") {
    const { appsDir, libsDir } = getWorkspaceLayout(this.tree);
    const baseDir = this.type === "application" ? appsDir : libsDir;
    return path.join(baseDir, this.getName(), relativePath);
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
    return this.names.kebabCase;
  }

  public getNames() {
    return this.names;
  }

  public getType() {
    return this.type;
  }
}
