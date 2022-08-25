import { tmpProjPath } from "@nrwl/nx-plugin/testing";
import path from "node:path";

export const e2eTmpPath = (relativePath = "") => {
  return path.join(tmpProjPath(), "..", relativePath);
};
