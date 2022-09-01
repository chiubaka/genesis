import { Tree } from "@nrwl/devkit";
import yaml from "js-yaml";

export function writeYaml(tree: Tree, filePath: string, object: any) {
  const yamlString = yaml.dump(object);

  tree.write(filePath, yamlString);
}
