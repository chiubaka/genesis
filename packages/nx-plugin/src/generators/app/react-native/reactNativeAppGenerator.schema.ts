import { AppGeneratorSchema } from "../appGenerator.schema";

export interface ReactNativeAppGeneratorSchema extends AppGeneratorSchema {
  displayName: string;
  packageName: string;
  androidEmulatorAvdName?: string;
  iosSimulatorDeviceType?: string;
}
