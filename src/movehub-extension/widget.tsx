/* Distributed under the terms of the Modified BSD License.

# This file comes from https://github.com/jupyter-robotics/ipylgbst and has been adapted for the current extension
#
# It is licensed under the following license:
#
# BSD License

Copyright (c) Dr Thorsten Beier

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
*/

import {
  DOMWidgetModel,
  DOMWidgetView,
  ISerializers
} from '@jupyter-widgets/base';
import { MODULE_NAME, MODULE_VERSION } from './version';
// Import the CSS
import '../../style/widget.css';
import { IBluetoothManager } from '../bluetooth/BluetoothManager';
import { movehubRegistryItem } from '.';
import { MoveHub } from './moveHub';
// @ts-expect-error To be fixed
import * as ReactDOMClient from 'react-dom/client';
// @ts-expect-error To be fixed
import { Root } from 'react-dom/client';
//import { DeviceInfoTableComplete } from './components/DeviceInfoTableComplete';
import MoveHubViewComponent from './components/MoveHubView';

// we use globals for the movehub device since connecting to
// them takes a long time. If the model would hold the
// movehub instance, we would need to re-connect any time
// we restart the kernel.

export class MoveHubModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: MoveHubModel.model_name,
      _model_module: MoveHubModel.model_module,
      _model_module_version: MoveHubModel.model_module_version,
      _view_name: MoveHubModel.view_name,
      _view_module: MoveHubModel.view_module,
      _view_module_version: MoveHubModel.view_module_version,
      _device_info: {},
      name: 'device1',
      identifier: '',
      n_lanes: 3
    };
  }

  private save_device_info() {
    const device_info = {
      polling_frame: this.polling_frame,
      lane_cmd_index: this.lane_cmd_index,
      ...this.movehub.deviceInfo
    };
    this.set('_device_info', device_info);
    this.save_changes();
  }

  poll() {
    this.polling_frame += 1;
    this.save_device_info();
  }

  polling() {
    this.poll();
    if (!this.stop_polling) {
      this.polling_is_running = true;
      setTimeout(this.polling.bind(this), 16);
    } else {
      this.polling_is_running = false;
    }
  }

  async initialize(attributes: any, options: any) {
    super.initialize(attributes, options);

    const n_lanes: number = this.get('n_lanes');
    console.log(`initialize with n_lanes=${n_lanes}`, this);
    const name: string = this.get('name');
    console.log(`initialize with name=${name}`);
    const identifier: string = this.get('identifier');
    console.log(`initialize with name=${identifier}`);

    this.on('msg:custom', async (command: any, buffers: any) => {
      const lane = command['lane'];
      this.lanes[lane] = this.lanes[lane].then(async () => {
        const await_in_kernel: boolean = command['args'];
        const await_in_frontend: boolean = command['args'];
        const p: Promise<void> = this.onCommand(command, buffers);
        if (await_in_frontend) {
          await p;
        }
        if (await_in_kernel) {
          this.lane_cmd_index[lane] += 1;
          this.save_device_info();
        }
      });
    });
  }

  private async onCommand(command: any, buffers: any) {
    console.log('onCommand', command);
    const cmd = command['command'];
    const args = command['args'] as Array<unknown>;

    if (cmd === 'connect') {
      await this.connect();
    } else if (cmd === 'disconnect') {
      this.disconnect();
    } else {
      if (this.movehub.deviceInfo.connected) {
        switch (cmd) {
          case 'poll':
            this.poll();
            break;
          case 'led':
            this.movehub.led.call(this.movehub, ...args);
            break;
          case 'ledAsync':
            await this.movehub.ledAsync.call(this.movehub, ...args);
            break;
          case 'motorTime':
            this.movehub.motorTime.call(this.movehub, ...args);
            break;
          case 'motorTimeMulti':
            this.movehub.motorTimeMulti.call(this.movehub, ...args);
            break;
          case 'motorTimeAsync':
            await this.movehub.motorTimeAsync.call(this.movehub, ...args);
            break;
          case 'motorTimeMultiAsync':
            await this.movehub.motorTimeMultiAsync.call(this.movehub, ...args);
            break;
          case 'motorAngle':
            this.movehub.motorAngle.call(this.movehub, ...args);
            break;
          case 'motorAngleMulti':
            this.movehub.motorAngleMulti.call(this.movehub, ...args);
            break;
          case 'motorAngleAsync':
            await this.movehub.motorAngleAsync.call(this.movehub, ...args);
            break;
          case 'motorAngleMultiAsync':
            await this.movehub.motorAngleMultiAsync.call(this.movehub, ...args);
            break;
          default:
            console.error(`unknown command "${cmd}"`);
            break;
        }
      } else {
        console.log(`cannot run command ${cmd} since we are not connected`);
      }
    }
  }

  async connect() {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const identifier = this.get('identifier');

    /*if (!this.movehub.deviceInfo.connected) {
      console.log('not connected yet');*/
    if (identifier === '') {
      this.movehub = (await MoveHubModel.bluetoothManager.connect(
        movehubRegistryItem
      )) as MoveHub;
    } else {
      const selectedDevice = MoveHubModel.bluetoothManager.deviceList.find(
        device => device.native.id === identifier
      );
      if (selectedDevice && selectedDevice instanceof MoveHub) {
        this.movehub = selectedDevice;
        console.log('MoveHub is:', this.movehub);
        //}
      }
      for (let i = 0; i < 30; i++) {
        await sleep(100);
        if (
          this.movehub.deviceInfo.connected &&
          this.movehub.hub !== undefined &&
          this.movehub.hub.connected
        ) {
          break;
        }
      }
      await sleep(4000);
    }

    // a bit ugly do this here
    const n_lanes: number = this.get('n_lanes');
    while (this.lane_cmd_index.length < n_lanes) {
      this.lane_cmd_index.push(0);
    }
    if (!this.polling_is_running) {
      this.polling_is_running = true;
      setTimeout(this.polling.bind(this), 200);
    }
  }

  static serializers: ISerializers = {
    ...DOMWidgetModel.serializers
    // Add any extra serializers here
  };

  disconnect() {
    console.log('disconnect');
    this.movehub.disconnect();
  }

  dispose() {
    console.log('remove model');
  }

  movehub: MoveHub;
  private polling_frame = 0;
  private polling_is_running = false;
  stop_polling = false;
  //private currentProcessing: Promise<void> = Promise.resolve();
  private lane_cmd_index: Array<number> = [0];
  private lanes: Array<Promise<void>> = [
    Promise.resolve(),
    Promise.resolve(),
    Promise.resolve()
  ];

  static model_name = 'MoveHubModel';
  static model_module = MODULE_NAME;
  static model_module_version = MODULE_VERSION;
  static view_name = 'MoveHubView'; // Set to null if no view
  static view_module = MODULE_NAME; // Set to null if no view
  static view_module_version = MODULE_VERSION;
  static bluetoothManager: IBluetoothManager;
}

export class MoveHubView extends DOMWidgetView {
  private root: Root | null = null;

  async render() {
    this.el.classList.add('jupyter-react-widget');
    this.root = ReactDOMClient.createRoot(this.el);
    const model = this.model as MoveHubModel;
    const moveHub = model.movehub;
    const areDevicesConnected =
      MoveHubModel.bluetoothManager.deviceList.length !== 0;
    this.root.render(
      <MoveHubViewComponent
        areMoveHubsAlreadyConnected={areDevicesConnected}
        bluetoothManager={MoveHubModel.bluetoothManager}
        moveHub={moveHub}
      />
    );
  }
  remove() {
    this.root?.unmount();
  }
}
