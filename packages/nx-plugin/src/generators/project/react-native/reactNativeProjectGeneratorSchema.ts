import { ProjectGeneratorSchema } from "../project";

export interface ReactNativeProjectGeneratorSchema
  extends ProjectGeneratorSchema {
  displayName?: string;
}
