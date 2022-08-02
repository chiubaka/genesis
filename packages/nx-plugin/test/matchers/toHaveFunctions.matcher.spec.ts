describe("toHaveFunctions", () => {
  it("passes when all specified functions exist", () => {
    expect(() => {
      expect({
        test: () => {
          return "foobar";
        },
      }).toHaveFunctions(["test"]);
    }).not.toThrow();
  });

  it("fails when a function is missing", () => {
    expect(() => {
      expect({}).toHaveFunctions(["test"]);
    }).toThrow("Expected value to have a test key");
  });

  it("fails when a function key exists but is not a function", () => {
    expect(() => {
      expect({ test: "foobar" }).toHaveFunctions(["test"]);
    }).toThrow("Expected test to be a function (received: string)");
  });
});
