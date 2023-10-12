import { FastlaneProjectGeneratorOwnOptions } from "../..";
import { AppGeneratorSchema } from "../appGenerator.schema";

export interface ReactNativeAppGeneratorSchema
  extends AppGeneratorSchema,
    FastlaneProjectGeneratorOwnOptions {
  appId: string;
  appName: string;
  androidEmulatorAvdName?: string;
  iosSimulatorDeviceType?: string;
  rubyVersion?: string;
  xcodeVersion?: string;
}
