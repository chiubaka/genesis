import { ProjectGeneratorSchema } from "../projectGenerator.schema";

export interface NodeProjectGeneratorSchema extends ProjectGeneratorSchema {
  rootProjectGeneratorName: string;
  tags?: string;
}
