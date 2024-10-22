import { LabIcon } from '@jupyterlab/ui-components';
import bluetoothConnectSvgstr from '../style/bluetoothConnect.svg';
import bluetoothDisconnectSvgstr from '../style/bluetoothDisconnect.svg';

export const BluetoothConnectIcon = new LabIcon({
  name: '@jupyterlab/jupyterlab-web-bluetooth-manager:bluetooth-connect',
  svgstr: bluetoothConnectSvgstr
});

export const BluetoothDisconnectIcon = new LabIcon({
  name: '@jupyterlab/jupyterlab-web-bluetooth-manager:bluetooth-disconnect',
  svgstr: bluetoothDisconnectSvgstr
});