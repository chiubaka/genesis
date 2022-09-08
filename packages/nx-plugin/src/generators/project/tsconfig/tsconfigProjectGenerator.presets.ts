import { TsConfigProjectGeneratorOwnOptions } from ".";

export const TsConfigGeneratorPresets: Record<
  string,
  TsConfigProjectGeneratorOwnOptions
> = {
  LIB: {
    baseConfig: {
      compilerOptions: {
        lib: ["es2015"],
        module: "commonjs",
        target: "es2015",
      },
    },
  },
  NODE18: {
    baseConfig: {
      compilerOptions: {
        lib: ["es2022"],
        module: "commonjs",
        target: "es2022",
      },
    },
    primaryConfig: {
      compilerOptions: {
        types: ["node"],
      },
    },
  },
  REACT: {
    baseConfig: {
      compilerOptions: {
        jsx: "react-jsx",
        lib: ["dom", "dom.iterable", "esnext"],
        module: "esnext",
        target: "es5",
      },
      files: [
        "../../node_modules/@nrwl/react/typings/cssmodule.d.ts",
        // https://github.com/chiubaka/genesis/issues/130
        // "../../node_modules/@nrwl/react/typings/image.d.ts",
      ],
    },
    testConfig: {
      compilerOptions: {
        module: "commonjs",
      },
    },
  },
};
