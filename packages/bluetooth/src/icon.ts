import { LabIcon } from '@jupyterlab/ui-components';
import bluetoothConnectSvgstr from '@bluetooth-manager/bluetooth/style/icons/bluetoothConnect.svg';
import bluetoothDisconnectSvgstr from '@bluetooth-manager/bluetooth/style/icons/bluetoothDisconnect.svg';


export const BluetoothConnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-connect',
  svgstr: bluetoothConnectSvgstr
});

export const BluetoothDisconnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-disconnect',
  svgstr: bluetoothDisconnectSvgstr
});
