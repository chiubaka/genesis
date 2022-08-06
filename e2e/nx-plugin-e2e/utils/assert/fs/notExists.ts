import { checkFilesExist } from "@nrwl/nx-plugin/testing";

export const notExists = (path: string) => {
  expect(() => {
    checkFilesExist(path);
  }).toThrow();
};
