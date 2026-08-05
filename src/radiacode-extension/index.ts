import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  IDeviceTypeRegistryItem,
  IBluetoothManager,
  BluetoothManager
} from '../bluetooth/BluetoothManager';
import { RadiacodeDetector } from './detector';
export const radiacodeServiceUUID = 'e63215e5-7003-49d8-96b0-b024798fb901';
export const radiacodeNotifyCharacteristicUUID =
  'e63215e7-7003-49d8-96b0-b024798fb901';
export const radiacodeWriteCharacteristicUUID =
  'e63215e6-7003-49d8-96b0-b024798fb901';
export const radiacodeRegistryItem: IDeviceTypeRegistryItem = {
  deviceType: 'Radiacode® 110',
  options: {
    acceptAllDevices: false,
    filters: [{ services: [radiacodeServiceUUID] }],
    optionalServices: [radiacodeServiceUUID]
  },
  factory: async (native: BluetoothDevice) => {
    const device = new RadiacodeDetector(native);
    await device.initDevice();
    return device;
  }
};

const RadiacodeDetectorRegisterPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:radiacode-detector-register-plugin',
  description:
    'Registers the radiacode detector device and provides a factory.',
  requires: [IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    bluetoothManager: BluetoothManager
  ): void => {
    console.log('JupyterLab radiacode-detector-register plugin is activated!');
    bluetoothManager.deviceTypeRegistry.added.connect(
      async (sender, radiacodeRegistryItem) => {
        console.warn(
          `New item from category ${radiacodeRegistryItem.deviceType} is added to the deviceType registry.`
        );
      }
    );
    bluetoothManager.deviceTypeRegistry.add(radiacodeRegistryItem);
  }
};

const RadiacodeDetectorExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  RadiacodeDetectorRegisterPlugin
];
export default RadiacodeDetectorExtensionPlugins;
