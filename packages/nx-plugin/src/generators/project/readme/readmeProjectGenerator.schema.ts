import { ProjectGeneratorSchema } from "../projectGenerator.schema";

export interface ReadmeProjectGeneratorSchema extends ProjectGeneratorSchema {
  rootProjectGeneratorName: string;
}
