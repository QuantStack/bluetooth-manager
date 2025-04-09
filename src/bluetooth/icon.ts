import { LabIcon } from '@jupyterlab/ui-components';
import bluetoothConnectSvgstr from '../..//style/bluetoothConnect.svg';
import bluetoothDisconnectSvgstr from '../..//style/bluetoothDisconnect.svg';
import LegoBrickSvgstr from '../..//style/LegoBrick.svg';
import Studs1Svgstr from '../..//style/studs1.svg';
import Studs2Svgstr from '../..//style/studs1.svg';
import StudsYellowSvgstr from '../..//style/studs-yellow.svg';
import GreenCircleSvgstr from '../../style/green-circle.svg';
import RedCircleSvgstr from '../../style/red-circle.svg';

export const BluetoothConnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-connect',
  svgstr: bluetoothConnectSvgstr
});

export const BluetoothDisconnectIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-disconnect',
  svgstr: bluetoothDisconnectSvgstr
});

export const LegoBrickIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-lego-brick',
  svgstr: LegoBrickSvgstr
});

export const Studs1Icon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-studs1',
  svgstr: Studs1Svgstr
});

export const Studs2Icon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-studs1',
  svgstr: Studs2Svgstr
});

export const StudsYellowIcon = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-studs-yellow',
  svgstr: StudsYellowSvgstr
});

export const GreenCircle = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-green-circle',
  svgstr: GreenCircleSvgstr
});

export const RedCircle = new LabIcon({
  name: '@jupyterlab/bluetooh-manager:bluetooth-red-circle',
  svgstr: RedCircleSvgstr
});
