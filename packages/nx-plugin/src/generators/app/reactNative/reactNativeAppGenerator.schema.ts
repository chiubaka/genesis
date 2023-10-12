import { FastlaneProjectGeneratorOwnOptions } from "../..";
import { AppGeneratorSchema } from "../appGenerator.schema";

export interface ReactNativeAppGeneratorSchema
  extends AppGeneratorSchema,
    FastlaneProjectGeneratorOwnOptions {
  appId: string;
  androidEmulatorAvdName?: string;
  iosSimulatorDeviceType?: string;
  xcodeVersion?: string;
}
