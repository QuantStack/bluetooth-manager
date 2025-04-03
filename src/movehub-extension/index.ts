import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IThemeManager, MainAreaWidget } from '@jupyterlab/apputils';
import { Toolbar } from '@jupyterlab/ui-components';
import {
  IDeviceRegistryItem,
  IBluetoothManager,
  BluetoothManager
} from '../bluetooth/BluetoothManager';
import { MoveHub } from './moveHub';
import ipymovehubPlugin from './plugin';
import { LegoBrickIcon } from '../bluetooth/icon';
import { MoveHubPanelWidget } from './components/MoveHubPanel';
import { LegoBuildSelectorWidget } from './components/LegoBuildSelector';
import { BatteryWidget } from './components/BatteryGauge';
import { DeviceIdentifierWidget } from './components/DeviceIdentifier';
import { ConnectionStatusWidget } from './components/ConnectionStatus';
export * from './version';
export * from './widget';
export const addLEGOMoveHubControlPanel =
  'bluetooth-manager:add-lego-movehub-control-panel';
export const connectMoveHub = 'bluetooth-manager:connect-movehub';
export const disconnectMoveHub = 'bluetooth-manager:disconnect-movehub';
export const moveHubServiceUUID = '00001623-1212-efde-1623-785feabcd123';
export const moveHubCharacteristicUUID = '00001624-1212-efde-1623-785feabcd123';
export const movehubRegistryItem: IDeviceRegistryItem = {
  identifier: 'LEGO® Move Hub',
  options: {
    acceptAllDevices: false,
    filters: [{ services: [moveHubServiceUUID] }],
    optionalServices: [moveHubServiceUUID]
  },
  factory: async (native: BluetoothDevice) => {
    const device = new MoveHub(native);
    await device.initDevice();
    const hub = device.hub;

    if (!hub) {
      throw new Error('Hub initialization failed.');
    }
    return device;
  }
};

const MoveHubRegisterPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:move-hub-register-plugin',
  description: 'Registers the move hub device and provides a factory.',
  requires: [IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    bluetoothManager: BluetoothManager
  ): void => {
    console.log('JupyterLab move-hub-register plugin is activated!');
    bluetoothManager.register(movehubRegistryItem);
  }
};

const LEGOMoveHubControlPanelPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooth-manager:lego-movehub-control-panel-plugin',
  description: 'Provides the ui to display informations on the Move Hub state.',
  requires: [ITranslator, IBluetoothManager, IThemeManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    translator: ITranslator,
    bluetoothManager: BluetoothManager,
    themeManager: IThemeManager
  ): void => {
    console.log('JupyterLab lego-movehub-control-panel plugin is activated!');
    const trans = translator.load('jupyterlab');


    app.commands.addCommand(addLEGOMoveHubControlPanel, {
      execute: args => {
        const result = bluetoothManager.deviceList.filter(
          device => device instanceof MoveHub
        );
        if (result) {
          const device = result[
            result.length - 1
          ] as MoveHub; /* the last added MoveHub device*/
          const content = new MoveHubPanelWidget(device, themeManager);
          content.addClass('jp-movehub-panel-content');
          const toolbar = new Toolbar();
          toolbar.addClass('jp-movehub-panel-toolbar');
          const main = new MainAreaWidget({ content, toolbar });
          main.addClass('jp-movehub-panel-main');
          main.toolbar.addItem(
            'connection-status',
            new ConnectionStatusWidget(device, bluetoothManager, app.commands)
          );
          main.toolbar.addItem(
            'select-lego-model',
            new LegoBuildSelectorWidget(device)
          );
          toolbar.addItem('spacer', Toolbar.createSpacerItem());
          main.toolbar.addItem('battery-gauge', new BatteryWidget(device, themeManager));
          main.toolbar.addItem(
            'device-identifier',
            new DeviceIdentifierWidget(device)
          );
          main.id = 'lego-movehub-control-panel';
          main.title.label = 'LEGO® Move Hub';
          main.title.closable = true;
          main.title.icon = LegoBrickIcon;
          app.shell.add(main, 'main');


        } else {
          throw new Error('The device is not a Move Hub.');
        }
      },
      caption: trans.__('Open a LEGO® Move Hub control panel'),
      label: trans.__('Open a LEGO® Move Hub Control Panel')
    });

    app.commands.addCommand(disconnectMoveHub, {
      execute: args => {
        const selectedDevice = bluetoothManager.deviceList.find((device) => device.native.id === args.deviceID as string);
        if (selectedDevice && selectedDevice instanceof MoveHub) {
          bluetoothManager.disconnectDevice(selectedDevice);
          return selectedDevice;
        } else {
          throw new Error('No device provided or device is invalid');
        }
      },
      caption: 'Disconnect MoveHub',
      label: 'Disconnect MoveHub',
      isEnabled: (args) => {
        const selectedDevice = bluetoothManager.deviceList.find((device) => device.native.id === args.deviceID as string);
        if (selectedDevice && selectedDevice instanceof MoveHub && selectedDevice.deviceInfo.connected) {
          return true;
        } else {
          return false;
        }
      }
    });
    
    app.commands.addCommand(connectMoveHub, {
      execute: args => {
        const newDevice = bluetoothManager.connectDevice(movehubRegistryItem);
        return newDevice;
      },
      caption: 'Connect MoveHub',
      label: 'Connect MoveHub',
      isEnabled: (args) => {
        const selectedDevice = bluetoothManager.deviceList.find((device) => device.native.id === args.deviceID as string);
        if (selectedDevice && selectedDevice instanceof MoveHub && selectedDevice.deviceInfo.connected) {
          return false;
        } else {
          return true;
        }
      }
    });
  }
};

const MoveHubExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  MoveHubRegisterPlugin,
  LEGOMoveHubControlPanelPlugin,
  ipymovehubPlugin
];
export default MoveHubExtensionPlugins;
