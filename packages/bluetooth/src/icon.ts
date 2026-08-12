import { LabIcon } from '@jupyterlab/ui-components';
import bluetoothConnectSvgstr from '../style/icons/bluetoothConnect.svg'
import bluetoothDisconnectSvgstr from '../style/icons/bluetoothDisconnect.svg';

export const BluetoothConnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-connect',
  svgstr: bluetoothConnectSvgstr
});

export const BluetoothDisconnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-disconnect',
  svgstr: bluetoothDisconnectSvgstr
});
