import {
  getWorkspaceLayout,
  names,
  ProjectType as NxProjectType,
  Tree,
} from "@nx/devkit";
import { getNpmScope } from "@nx/js/src/utils/package-json/get-npm-scope";
import path from "node:path";
import { TreeWriteOptions } from "nx/src/generators/tree";

import { ProjectGeneratorSchema } from "../generators/project/project/projectGenerator.schema";

export type ProjectType = NxProjectType | "e2e";

export interface ProjectNames {
  camelCase: string;
  kebabCase: string;
  pascalCase: string;
  snakeCase: string;
}

export class Project {
  private tree: Tree;
  private names: ProjectNames;
  private type: ProjectType;

  public static createFromOptions(tree: Tree, options: ProjectGeneratorSchema) {
    const { projectName, projectType } = options;
    return new Project(tree, projectName, projectType);
  }

  constructor(tree: Tree, name: string, type: ProjectType) {
    this.tree = tree;
    this.type = type;

    const {
      className: pascalCase,
      constantName: upperSnakeCase,
      fileName: kebabCase,
      propertyName: camelCase,
    } = names(name);

    this.names = {
      camelCase,
      kebabCase,
      pascalCase,
      snakeCase: upperSnakeCase.toLowerCase(),
    };
  }

  public write(
    path: string,
    content: string | Buffer,
    options?: TreeWriteOptions,
  ) {
    this.tree.write(this.path(path), content, options);
  }

  public path(relativePath = "") {
    return this.baseDir(path.join(this.getName(), relativePath));
  }

  public relativePath(relativePath = "") {
    const baseDirName = path.basename(this.baseDir());

    return path.join(baseDirName, this.getName(), relativePath);
  }

  public srcPath(relativePath = "") {
    return path.join(this.path("src"), relativePath);
  }

  public testPath(relativePath = "") {
    return path.join(this.path("test"), relativePath);
  }

  public distPath(relativePath = "") {
    return path.join("dist", this.relativePath(relativePath));
  }

  public jestConfigPath() {
    return this.path("jest.config.ts");
  }

  public getPrimaryTsConfigName() {
    return this.getType() === "application" || this.getType() === "e2e"
      ? "tsconfig.app.json"
      : "tsconfig.lib.json";
  }

  public getTree() {
    return this.tree;
  }

  public getScope() {
    const scope = getNpmScope(this.tree);

    if (!scope) {
      throw new Error(
        `Unexpectedly could not determine scope for project ${this.getName()}`,
      );
    }

    return scope;
  }

  public getName() {
    return this.names.kebabCase;
  }

  public getNames() {
    return this.names;
  }

  public getImportPath() {
    return `@${this.getScope()}/${this.getName()}`;
  }

  public getType() {
    return this.type;
  }

  public getMeta() {
    return {
      projectName: this.getName(),
      projectType: this.getType(),
    };
  }

  private baseDir(relativePath = "") {
    const { appsDir, libsDir } = getWorkspaceLayout(this.tree);

    const isPackagesLayout = path.basename(libsDir) === "packages";

    let baseDir = libsDir;
    if (
      (isPackagesLayout && this.type === "e2e") ||
      (!isPackagesLayout && this.type === "application")
    ) {
      baseDir = appsDir;
    }

    return path.join(baseDir, relativePath);
  }
}
