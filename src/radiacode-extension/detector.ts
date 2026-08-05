import { BluetoothManager } from '../bluetooth/BluetoothManager';
import { DeviceInfo } from './type';
import { buildShortIdentifier } from '../bluetooth-extension';
import {
  radiacodeNotifyCharacteristicUUID,
  radiacodeServiceUUID,
  radiacodeWriteCharacteristicUUID
} from '.';
//import { Buffer } from '../movehub-extension/moveHub/helpers/buffer';
import { ProtocolManager } from './protocol/protocolManager';
import { COMMAND } from './protocol/parsing';

export const defaultDeviceInfo: DeviceInfo = {
  err: '',
  connected: false,
  batteryLevel: undefined,
  identifier: '',
  primaryMACAddress: ''
};

export class RadiacodeDetector extends BluetoothManager.Device {
  public deviceInfo: DeviceInfo;
  public notifyCharacteristic: BluetoothRemoteGATTCharacteristic | undefined;
  public writeCharacteristic: BluetoothRemoteGATTCharacteristic | undefined;
  public protocolManager: ProtocolManager;

  constructor(native: BluetoothDevice) {
    super(native);
    this.deviceInfo = defaultDeviceInfo;
  }

  async initDevice(): Promise<void> {
    this.connected.connect(async (sender, connected: boolean) => {
      if (connected) {
        this.deviceInfo.connected = connected;
        this.isConnected = connected;
      }
      console.warn('The connection state is', this.isConnected);
      this.deviceInfo.identifier = buildShortIdentifier(this.native);
    });
    this.disconnected.connect(async (sender, disconnected: boolean) => {
      if (disconnected) {
        this.deviceInfo.connected = false;
        this.isConnected = false;
      }
      console.warn('The connection state is', this.isConnected);
    });

    this.writeCharacteristic = await this.getCharacteristic(
      radiacodeServiceUUID,
      radiacodeWriteCharacteristicUUID
    );

    this.notifyCharacteristic = await this.getCharacteristic(
      radiacodeServiceUUID,
      radiacodeNotifyCharacteristicUUID
    );
    this.protocolManager = new ProtocolManager(
      this.notifyCharacteristic,
      this.writeCharacteristic
    );

    await this.protocolManager.init();

    /* this.protocolManager.readData(new Uint8Array([0x11, 0x05, 0x00, 0x00]), COMMAND.RD_VIRT_SFR, "brightness").then((brightness) => {
             console.log(`Read ${brightness} command sent successfully.`);
         }).catch(error => {
             console.error('Error sending read brightness command:', error);
         });*/

    /*this.protocolManager.readData(new Uint8Array([0x24, 0x08, 0x00, 0x00]), COMMAND.RD_VIRT_SFR, "temperature").then((temperature) => {
            console.log(`Read ${temperature} command sent successfully.`);
        }).catch(error => {
            console.error('Error sending read temperature command:', error);
        });*/

    try {
      const brightness = await this.protocolManager.readData(
        new Uint8Array([0x11, 0x05, 0x00, 0x00]),
        COMMAND.RD_VIRT_SFR,
        'brightness'
      );
      console.log(`Read ${brightness} command returned successfully.`);
    } catch (error) {
      console.error('Error sending read brightness command:', error);
    }
  }
}
