describe("toHaveProperties", () => {
  it("passes when the value has all specified properties", () => {
    expect(() => {
      expect({ foo: "foo", bar: "bar" }).toHaveProperties(["foo", "bar"]);
    }).not.toThrow();
  });

  it("fails when value has none of the specified properties", () => {
    expect(() => {
      expect({}).toHaveProperties(["foo", "bar"]);
    }).toThrow("Expected value to have a foo property");
  });

  it("fails when value has some but not all of the specified properties", () => {
    expect(() => {
      expect({ foo: "foo" }).toHaveProperties(["foo", "bar"]);
    }).toThrow("Expected value to have a bar property");
  });
});
