import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface JestProjectGeneratorSchema
  extends JestProjectGeneratorOwnOptions,
    ProjectGeneratorBaseSchema {}

export interface JestProjectGeneratorOwnOptions {
  enableReact?: boolean;
  testEnvironment?: "node" | "jsdom";
}
