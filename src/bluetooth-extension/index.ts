import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ITranslator } from '@jupyterlab/translation';
import { IRunningSessions, IRunningSessionManagers } from '@jupyterlab/running';
import { addIcon, CommandToolbarButton } from '@jupyterlab/ui-components';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { BluetoothDeviceRunningItem } from '../bluetooth/BluetoothDeviceRunningItem';
import {
  IBluetoothManager,
  BluetoothManager
} from '../bluetooth/BluetoothManager';

export namespace CommandIDs {
  export const openDeviceRegistryDialog =
    'bluetooth-manager:open-dialog-for-devices-registry';
  export const disconnectDevice = 'bluetooth-manager:disconnect-device';
}

export function buildCompleteIdentifier(native: BluetoothDevice): string {
  const identifier = native.name?.replace(/\s+/g, '-') + '-' + native.id;
  return identifier;
}

export function buildShortIdentifier(native: BluetoothDevice): string {
  const identifier = native.id;
  return identifier;
}

const BluetoothManagerPlugin: JupyterFrontEndPlugin<IBluetoothManager> = {
  id: 'bluetooh-manager:bluetooth-manager-plugin',
  description: 'Provides the bluetooth manager',
  provides: IBluetoothManager,
  autoStart: true,
  activate: (app: JupyterFrontEnd): IBluetoothManager => {
    console.log('JupyterLab bluetooth-manager-plugin is activated!');
    const bluetoothManager = new BluetoothManager();
    bluetoothManager.deviceListChanged.connect(
      async (sender, deviceList: Array<BluetoothManager.Device>) => {
        console.warn(
          'The list of devices has been updated and is now: ',
          deviceList
        );
      }
    );
    return bluetoothManager;
  }
};

const BluetoothSidebarPlugin: JupyterFrontEndPlugin<void> = {
  id: 'bluetooh-manager:bluetooth-sidebar-plugin',
  description:
    'Provides the connected bluetooth devices dialog to populate the sidebar.',
  requires: [IRunningSessionManagers, ITranslator, IBluetoothManager],
  autoStart: true,
  activate: (
    app: JupyterFrontEnd,
    managers: IRunningSessionManagers,
    translator: ITranslator,
    bluetoothManager: IBluetoothManager
  ): void => {
    console.log('JupyterLab bluetooth-sidebar plugin is activated!');
    const trans = translator.load('jupyterlab');
    const { commands } = app;
    const openDeviceRegistryDialogLabel = trans.__(
      'Add a Device'
    );
    let runningItemsList: Array<IRunningSessions.IRunningItem>;

    function createTestFunction(device: BluetoothManager.Device) {
      return function test(node: HTMLElement): boolean {
        const testString = buildCompleteIdentifier(device.native);
        return node.title === testString;
      };
    }

    commands.addCommand(CommandIDs.disconnectDevice, {
      execute: async args => {
        bluetoothManager.deviceList.filter(item => {
          const testWithDevice = createTestFunction(item);
          const node = app.contextMenuHitTest(testWithDevice);
          const identifier = buildCompleteIdentifier(item.native);
          if (identifier === node?.title) {
            bluetoothManager.disconnectDevice(item);
          }
        });
      },
      caption: trans.__('Disconnect device'),
      label: trans.__('Disconnect Device')
    });

    /* Adding commands to the context menu of the relevant connected device*/
    app.contextMenu.addItem({
      command: CommandIDs.disconnectDevice,
      selector: 'jp-tree-item.jp-RunningSessions-item.jp-bluetooth-Move-Hub',
      rank: 0
    });

    app.commands.addCommand(CommandIDs.openDeviceRegistryDialog, {
      execute: async () => {
        showDialog({
          title: 'Select device type',
          body: new DropDownRegistry(bluetoothManager.registry),
          buttons: [
            Dialog.okButton({ label: 'Select' }),
            Dialog.cancelButton({ label: 'Cancel' })
          ]
        }).then(async result => {
          if (result.button.accept) {
            bluetoothManager.registry.itemsList.forEach(async item => {
              if (item.identifier === result.value) {
                await bluetoothManager.connectDevice(item);
              } else {
                console.warn('There is no corresponding item in the registry!');
              }
            });
          }
        });
      }
    });

    managers.add({
      name: trans.__('Bluetooth Devices'),
      supportsMultipleViews: false,
      running: () => {
        runningItemsList = [];
        bluetoothManager.deviceList.forEach(device => {
          runningItemsList.push(
            new BluetoothDeviceRunningItem(
              device,
              bluetoothManager as BluetoothManager
            )
          );
        });
        return runningItemsList;
      },
      shutdownAll: () => {
        bluetoothManager.removeAllDevices(bluetoothManager.deviceList);
      },
      refreshRunning: () => {
        return void 0;
      },
      runningChanged: bluetoothManager.deviceListChanged,
      shutdownLabel: trans.__('Disconnect'),
      shutdownAllLabel: trans.__('Disconnect All'),
      shutdownAllConfirmationText: trans.__(
        'Are you sure you want to disconnect all devices?'
      ),
      toolbarButtons: [
        new CommandToolbarButton({
          commands,
          id: CommandIDs.openDeviceRegistryDialog,
          icon: addIcon,
          caption: openDeviceRegistryDialogLabel,
          args: { toolbar: false }
        })
      ]
    });
  }
};

export class DropDownRegistry
  extends Widget
  implements Dialog.IBodyWidget<string>
{
  constructor(registry: BluetoothManager.DeviceRegistry) {
    super();
    this._selectList = document.createElement('select');
    this.node.appendChild(this._selectList);
    this.registry = registry;
    registry.itemsList.forEach(item => {
      const option = document.createElement('option');
      option.value = item.identifier;
      option.text = item.identifier;
      this._selectList.appendChild(option);
    });
  }

  getValue(): string {
    return this._selectList.value;
  }

  private _selectList: HTMLSelectElement;
  public registry: BluetoothManager.DeviceRegistry;
}

const BluetoothExtensionPlugins: JupyterFrontEndPlugin<any>[] = [
  BluetoothManagerPlugin,
  BluetoothSidebarPlugin
];
export default BluetoothExtensionPlugins;
