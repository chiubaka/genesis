import { AppGeneratorSchema } from "../appGenerator.schema";

export interface ReactNativeAppGeneratorSchema extends AppGeneratorSchema {
  displayName: string;
  appId: string;
  androidEmulatorAvdName?: string;
  iosSimulatorDeviceType?: string;
}
