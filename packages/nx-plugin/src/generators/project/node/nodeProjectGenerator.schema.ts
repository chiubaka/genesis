import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface NodeProjectGeneratorSchema extends ProjectGeneratorBaseSchema {
  rootProjectGeneratorName: string;
  tags?: string;
}
