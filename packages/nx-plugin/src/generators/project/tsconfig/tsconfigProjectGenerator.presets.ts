export const TsConfigGeneratorPresets = {
  LIB: {
    lib: ["es2015"],
    module: "commonjs",
    target: "es2015",
  },
  NODE18: {
    appLibTypes: ["node"],
    lib: ["es2022"],
    module: "commonjs",
    target: "es2022",
  },
  REACT: {
    lib: ["dom", "dom.iterable", "esnext"],
    module: "esnext",
    target: "es5",
    jsx: "react-jsx",
  },
};
