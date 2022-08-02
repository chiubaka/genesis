export const toHaveProperties = (
  value: object,
  propertyNames: string[],
): jest.CustomMatcherResult => {
  for (const propertyName of propertyNames) {
    if (!value.hasOwnProperty(propertyName)) {
      return {
        pass: false,
        message: () => {
          return `Expected value to have a ${propertyName} property`;
        },
      };
    }
  }

  return {
    pass: true,
    message: () => {
      return `Expected value to have properties ${propertyNames.toString()}`;
    },
  };
};
