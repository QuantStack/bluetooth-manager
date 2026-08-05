/** Information from Radiacode 110 device */
export type DeviceInfo = {
  connected: boolean;
  err?: any;
  batteryLevel: number | undefined;
  identifier: string;
  primaryMACAddress: string | undefined;
};
