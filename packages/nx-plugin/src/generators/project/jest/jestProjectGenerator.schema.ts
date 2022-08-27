import { ProjectGeneratorSchema } from "../projectGenerator.schema";

export interface JestProjectGeneratorSchema extends ProjectGeneratorSchema {
  testEnvironment?: "node" | "jsdom";
}
