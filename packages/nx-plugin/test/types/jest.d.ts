// import { FileWithContentMatcherOptions } from "../matchers/toHaveFileWithContent.matcher";

declare namespace jest {
  interface Matchers {
    toBeNxTree: () => CustomMatcherResult;
    toHaveDependencies: (
      expectedDependencies: Record<string, string | undefined>,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHaveDependency: (
      dependencyName: string,
      dependencyVersion?: string,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHaveDevDependencies: (
      expectedDevDependencies: Record<string, string | undefined>,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHaveDevDependency: (
      dependencyName: string,
      dependencyVersion?: string,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHaveFileWithContent: (
      filePath: string,
      content: string,
      options?: FileWithContentMatcherOptions,
    ) => CustomMatcherResult;
    toHaveFunctions: (functionNames: string[]) => CustomMatcherResult;
    toHavePeerDependencies: (
      expectedPeerDependencies: Record<string, string | undefined>,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHavePeerDependency: (
      dependencyName: string,
      dependencyVersion?: string,
      packageJsonPath?: string,
    ) => CustomMatcherResult;
    toHaveProperties: (propertyNames: string[]) => CustomMatcherResult;
    toHaveRenamedFile: (
      oldPath: string,
      newPath: string,
    ) => CustomMatcherResult;
  }
}
