import { AppGeneratorSchema } from "../appGenerator.schema";

export interface ReactNativeAppGeneratorSchema extends AppGeneratorSchema {
  displayName: string;
  androidEmulatorAvdName?: string;
  iosSimulatorDeviceType?: string;
}
