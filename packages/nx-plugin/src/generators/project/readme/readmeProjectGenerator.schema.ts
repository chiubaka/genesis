import { ProjectGeneratorBaseSchema } from "../projectGeneratorBase.schema";

export interface ReadmeProjectGeneratorSchema
  extends ProjectGeneratorBaseSchema {
  rootProjectGeneratorName: string;
  additionalSetupSteps?: string;
}
