import { IMoveHubPanelProps } from './MoveHubPanel';
import ColoredCircleWithText from './ColoredCircleWithText';
import { useEffect, useState } from 'react';
import { Poll } from '@lumino/polling';
import { DeviceInfo } from '../moveHub/types';
import { defaultDeviceInfo, MoveHub } from '../moveHub';
import { ReactWidget } from '@jupyterlab/ui-components';
import { Menu } from '@lumino/widgets';
import { CommandRegistry } from '@lumino/commands';
import { BluetoothManager } from '../../bluetooth/BluetoothManager';
export const connectMoveHub = 'bluetooth-manager:connect-movehub';
export const disconnectMoveHub = 'bluetooth-manager:disconnect-movehub';
import { movehubRegistryItem } from '..';

export default function ConnectionStatus({ device }: IMoveHubPanelProps) {
  const [deviceState, setDeviceState] = useState<DeviceInfo>(defaultDeviceInfo);

  useEffect(() => {
    const poll = new Poll({
      auto: true,
      name: 'device-status-polling',
      factory: async () => {
        setDeviceState({ ...device.deviceInfo });
      },
      frequency: {
        interval: 200,
        backoff: true
      },
      standby: 'when-hidden'
    });

    poll.start();

    return () => {
      poll.stop();
    };
  }, [device.deviceInfo]);

  return deviceState.connected ? (
    <ColoredCircleWithText color={'green'} text={''} />
  ) : (
    <ColoredCircleWithText color={'red'} text={''} />
  );
}

export class ConnectionStatusWidget extends ReactWidget {
  public device: MoveHub;
  public menu: Menu
  public commands: CommandRegistry

  constructor(device: MoveHub, bluetoothManager: BluetoothManager) {
    super();
    this.device = device;
    this.commands = new CommandRegistry();
    this.commands.addCommand(disconnectMoveHub, {
      execute: args => {
        bluetoothManager.disconnectDevice(device);
        return device;
      },
      caption: ('Disconnect MoveHub'),
      label: ('Disconnect MoveHub'),
      isEnabled: () => {
        if (device.deviceInfo.connected) {
          return true
        }
        else { return (false) }
      }
    });
    this.commands.addCommand(connectMoveHub, {
      execute: args => {
        const newDevice =
          bluetoothManager.connectDevice(movehubRegistryItem);
        return newDevice;
      },
      caption: ('Connect MoveHub'),
      label: ('Connect MoveHub'),
      isEnabled: () => {
        if (device.deviceInfo.connected) {
          return false
        }
        else { return (true) }
      }
    });
    this.menu = new Menu({ commands: this.commands });
    this.menu.addItem({
      command: disconnectMoveHub
    });
    this.menu.addItem({
      command: connectMoveHub
    });
    this.menu.addClass('jp-connection-status-menu')
  }

  openMenu(event: React.MouseEvent<HTMLDivElement>) {
    console.log('You have clicked')
    if (this.menu && typeof this.menu.isVisible !== 'undefined') {
      this.menu.open(event.clientX, event.clientY);
    } else {
      console.error('Menu or isVisible property is undefined');
    }
  }

  render() {
    return (
      <div
        title='Open Connection Status Menu'
        onClick={(event) => this.openMenu(event)}
        className="jp-connection-status-button"
      >
        <ConnectionStatus device={this.device} />
      </div>
    );
  }
}
