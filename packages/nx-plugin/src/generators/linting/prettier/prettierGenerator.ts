import { addDependenciesToPackageJson, Tree, updateJson } from "@nrwl/devkit";

export interface PrettierConfig {
  singleQuote?: boolean;
  trailingComma?: "es5" | "none" | "all";
}

export function prettierGenerator(tree: Tree) {
  updateJson<PrettierConfig>(tree, ".prettierrc", (json) => {
    json.singleQuote = false;
    json.trailingComma = "all";
    return json;
  });

  addDependenciesToPackageJson(tree, {}, { prettier: "latest" });
}
