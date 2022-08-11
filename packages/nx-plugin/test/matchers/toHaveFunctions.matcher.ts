export const toHaveFunctions = (
  value: any,
  functionNames: string[],
): jest.CustomMatcherResult => {
  for (const functionName of functionNames) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, security/detect-object-injection, @typescript-eslint/no-unsafe-member-access
    const maybeFunction = value[functionName];

    if (!maybeFunction) {
      return {
        pass: false,
        message: () => {
          return `Expected value to have a ${functionName} key`;
        },
      };
    }

    const type = typeof maybeFunction;

    if (type !== "function") {
      return {
        pass: false,
        message: () => {
          return `Expected ${functionName} to be a function (received: ${type})`;
        },
      };
    }
  }

  return {
    pass: true,
    message: () => {
      return `Expected value to have functions with names ${functionNames.toString()}`;
    },
  };
};
