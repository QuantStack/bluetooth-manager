import { IRunningSessions } from '@jupyterlab/running';
import { BluetoothConnectIcon } from './icon';
import { BluetoothManager } from './BluetoothManager';
import { buildCompleteIdentifier } from '../bluetooth-extension';
import { Menu } from '@lumino/widgets';
import { CommandRegistry } from '@lumino/commands';

export const disconnectDevice = 'bluetooth-manager:disconnect-device';

export class BluetoothDeviceRunningItem
  implements IRunningSessions.IRunningItem {
  constructor(device: BluetoothManager.Device, bluetoothManager: BluetoothManager, commands: CommandRegistry) {
    this._device = device;
    this.bluetoothManager = bluetoothManager;
    if (this._device.native.name) {
      const deviceName = this._device.native.name;
      this.className = 'jp-bluetooth-' + deviceName.replace(/\s+/g, '-');
    }
    this.commands = commands;
  }

  className?: string | undefined;

  open() {
    const commands = this.commands;
    const deviceID = this._device.native.id;
  
    const menu = new Menu({ commands: commands });
    menu.addItem({
      command: disconnectDevice,
      args: {deviceID}
    });

    const commandList = commands.listCommands();
    commandList.map((command: string) => {
      if (command.includes('bluetooth-manager') && !command.includes("disconnect")) {
        menu.addItem({ command: command})
      }
    })

    menu.addClass('jp-bluetooth-device-running-item-menu')
    const deviceElement = document.querySelector(`.${this.className}`);
    if (deviceElement) {
      const rect = deviceElement.getBoundingClientRect();
      const x = rect.left;
      const y = rect.bottom;
      menu.open(x, y);
    }
  }

  icon() {
    return BluetoothConnectIcon;
  }

  label() {
    //return this._device.native.name+ '\u00A0'.repeat(30) + this._device.native.id;
    return this._device.native.name + ' (' + this._device.native.id + ')';
  }

  labelTitle() {
    const title = buildCompleteIdentifier(this._device.native);
    return title;
  }

  shutdown() {
    this.bluetoothManager.disconnectDevice(this._device);
  }

  private _device: BluetoothManager.Device;
  public bluetoothManager: BluetoothManager;
  public commands: CommandRegistry;
}
