import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface JestProjectGeneratorSchema
  extends JestProjectGeneratorOwnOptions,
    ProjectGeneratorBaseSchema {}

export interface JestProjectGeneratorOwnOptions {
  testEnvironment?: "node" | "jsdom";
}
