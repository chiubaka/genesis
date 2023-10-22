import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface JestProjectGeneratorSchema
  extends JestProjectGeneratorOwnOptions,
    ProjectGeneratorBaseSchema {}

export interface JestProjectGeneratorOwnOptions {
  reactNative?: boolean;
  enableReact?: boolean;
  testEnvironment?: "node" | "jsdom";
}
