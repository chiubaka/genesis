import { ProjectGeneratorSchema } from "../project/projectGenerator.schema";

export interface ReadmeProjectGeneratorSchema extends ProjectGeneratorSchema {
  rootProjectGeneratorName: string;
}
