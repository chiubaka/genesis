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
    toHaveFunctions: (functionNames: string[]) => CustomMatcherResult;
    toHaveProperties: (propertyNames: string[]) => CustomMatcherResult;
  }
}
