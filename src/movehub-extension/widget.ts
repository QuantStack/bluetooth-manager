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
  ISerializers,
} from '@jupyter-widgets/base';

import { MODULE_NAME, MODULE_VERSION } from './version';

// Import the CSS
import '../../style/widget.css';
import { IBluetoothManager } from '../bluetooth/BluetoothManager';
import { movehubRegistryItem } from '.';
import { MoveHub } from './moveHub';

// we use globals for the movehub device since connecting to
// them takes a long time. If the model would hold the
// movehub instance, we would need to re-connect any time
// we restart the kernel.

/*interface deviceCache {
  [key: string]: any;
}*/

//const device_cache: deviceCache = {};

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
  /*if (!(name in device_cache)) {
      device_cache[name] = await MoveHubModel.bluetoothManager.connectDevice(movehubRegistryItem);
    }*/

    //this.movehub = device_cache[name];
    this.movehub = await MoveHubModel.bluetoothManager.connectDevice(movehubRegistryItem);
    

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
    const args = command['args'];

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
            this.movehub.led.apply(this.movehub, args);
            break;
          case 'ledAsync':
            await this.movehub.ledAsync.apply(this.movehub, args);
            break;

          case 'motorTime':
            this.movehub.motorTime.apply(this.movehub, args);
            break;

          case 'motorTimeMulti':
            this.movehub.motorTimeMulti.apply(this.movehub, args);
            break;

          case 'motorTimeAsync':
            await this.movehub.motorTimeAsync.apply(this.movehub, args);
            break;

          case 'motorTimeMultiAsync':
            await this.movehub.motorTimeMultiAsync.apply(this.movehub, args);
            break;

          case 'motorAngle':
            this.movehub.motorAngle.apply(this.movehub, args);
            break;

          case 'motorAngleMulti':
            this.movehub.motorAngleMulti.apply(this.movehub, args);
            break;

          case 'motorAngleAsync':
            await this.movehub.motorAngleAsync.apply(this.movehub, args);
            break;

          case 'motorAngleMultiAsync':
            await this.movehub.motorAngleMultiAsync.apply(this.movehub, args);
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

    if (!this.movehub.deviceInfo.connected) {
      console.log('not connected yet');
      this.movehub = await MoveHubModel.bluetoothManager.connectDevice(movehubRegistryItem);
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
  txt_connected: HTMLDivElement;
  txt_bluetooth: HTMLDivElement;

  txt_pitch: HTMLDivElement;
  txt_roll: HTMLDivElement;
  txt_distance: HTMLDivElement;
  txt_color: HTMLDivElement;

  txt_port_a: HTMLDivElement;
  txt_port_b: HTMLDivElement;
  txt_port_ab: HTMLDivElement;
  txt_port_c: HTMLDivElement;
  txt_port_d: HTMLDivElement;

  meter_pitch: HTMLMeterElement;
  meter_roll: HTMLMeterElement;
  meter_distance: HTMLMeterElement;
  color_color: HTMLDivElement;

  isWebBluetoothSupported: boolean = navigator.bluetooth ? true : false;


  

  render() {
    this.el.classList.add('custom-widget');

    // checking if Web Bluetooth API is supported
    if (!this.isWebBluetoothSupported) {
      // bluetooth error box
      const bluetooth_box = document.createElement('div');
      bluetooth_box.classList.add('error-box');
      this.el.appendChild(bluetooth_box);

      this.txt_bluetooth = document.createElement('div');
      this.txt_bluetooth.textContent =
        "Your device doesn't support Web Bluetooth API. Try to turn on Experimental Platform Features from Chrome, by accessing the following link and turning it on: chrome://flags/#enable-experimental-web-platform-features";
      bluetooth_box.appendChild(this.txt_bluetooth);

      console.log(
        "Your device doesn't support Web Bluetooth API. Try to turn on Experimental Platform Features from Chrome, by accessing the following link and turning it on: chrome://flags/#enable-experimental-web-platform-features"
      );
    }

    // connection box
    const connection_box = document.createElement('div');
    connection_box.classList.add('box');
    this.el.appendChild(connection_box);
    
    // sensor box
    const sensor_box = document.createElement('div');
    sensor_box.classList.add('box');
    this.el.appendChild(sensor_box);

    // motor box
    const motor_box = document.createElement('div');
    motor_box.classList.add('box');
    this.el.appendChild(motor_box);
    
    // connected
    this.txt_connected = document.createElement('div');
    this.txt_connected.textContent = 'Disconnected';
    connection_box.appendChild(this.txt_connected);
    
    // pitch
    this.txt_pitch = document.createElement('div');
    this.txt_pitch.textContent = 'pitch1:';
    sensor_box.appendChild(this.txt_pitch);
    this.meter_pitch = document.createElement('meter');
    sensor_box.appendChild(this.meter_pitch);
    this.meter_pitch.min = -90;
    this.meter_pitch.max = 90;

    // roll
    this.el.appendChild(document.createElement('br'));
    this.txt_roll = document.createElement('div');
    this.txt_roll.textContent = 'roll:';
    sensor_box.appendChild(this.txt_roll);
    this.meter_roll = document.createElement('meter');
    sensor_box.appendChild(this.meter_roll);
    this.meter_roll.min = -90;
    this.meter_roll.max = 90;
    

    // distance
    sensor_box.appendChild(document.createElement('br'));
    this.txt_distance = document.createElement('div');
    this.txt_distance.textContent = 'distance:';
    sensor_box.appendChild(this.txt_distance);
    this.meter_distance = document.createElement('meter');
    sensor_box.appendChild(this.meter_distance);
    this.meter_distance.min = 0;
    this.meter_distance.max = 255;

    // color
    sensor_box.appendChild(document.createElement('br'));
    this.txt_color = document.createElement('div');
    this.txt_color.textContent = 'color:';
    sensor_box.appendChild(this.txt_color);
    this.color_color = document.createElement('div');
    sensor_box.appendChild(this.color_color);
    this.color_color.textContent = 'None';
    //this.changes();

    // motor ports
    motor_box.appendChild(document.createElement('br'));
    this.txt_port_a = document.createElement('div');
    this.txt_port_a.textContent = 'Port A:';
    motor_box.appendChild(this.txt_port_a);
    

    motor_box.appendChild(document.createElement('br'));
    this.txt_port_b = document.createElement('div');
    this.txt_port_b.textContent = 'Port B:';
    motor_box.appendChild(this.txt_port_b);

    motor_box.appendChild(document.createElement('br'));
    this.txt_port_ab = document.createElement('div');
    this.txt_port_ab.textContent = 'Port AB:';
    motor_box.appendChild(this.txt_port_ab);

    motor_box.appendChild(document.createElement('br'));
    this.txt_port_c = document.createElement('div');
    this.txt_port_c.textContent = 'Port C:';
    motor_box.appendChild(this.txt_port_c);

    motor_box.appendChild(document.createElement('br'));
    this.txt_port_d = document.createElement('div');
    this.txt_port_d.textContent = 'Port D:';
    motor_box.appendChild(this.txt_port_d);
    

    this.model.on('change:_device_info', this.changes, this);
    
  }

  changes() {
    const model = this.model as MoveHubModel;
    const deviceInfo = model.movehub.deviceInfo;

    if (deviceInfo.connected !== undefined && deviceInfo.connected) {
      this.txt_connected.textContent = 'Connected';

      this.meter_roll.value = deviceInfo['tilt']['roll'];
      this.txt_roll.textContent = `roll: ${deviceInfo['tilt']['roll']}`;

      this.meter_pitch.value = deviceInfo['tilt']['pitch'];
      this.txt_pitch.textContent = `pitch1: ${deviceInfo['tilt']['pitch']}`;

      const distance = deviceInfo['distance'];
      if (distance !== undefined && distance !== null && isFinite(distance)) {
        this.meter_distance.value = distance;
        this.txt_distance.textContent = `distance: ${distance}`;
      } else {
        this.meter_distance.value = 255;
        this.txt_distance.textContent = 'distance: ∞';
      }

      const color = deviceInfo['color'];
      if (color !== undefined && color !== null) {
        this.color_color.textContent = `${color}`;
        this.color_color.style.backgroundColor = color;
        //this.txt_color.textContent = `color: ${c}`
      } else {
        this.color_color.textContent = 'None';
        this.color_color.style.backgroundColor = '#444';
        //this.txt_color.textContent = `color: None`
      }
      this.txt_port_a.textContent = `Port A:  ${deviceInfo['ports']['A']['action']} ${deviceInfo['ports']['A']['angle']}`;
      this.txt_port_b.textContent = `Port B:  ${deviceInfo['ports']['B']['action']} ${deviceInfo['ports']['B']['angle']}`;
      this.txt_port_ab.textContent = `Port AB: ${deviceInfo['ports']['AB']['action']} ${deviceInfo['ports']['AB']['angle']}`;
      this.txt_port_c.textContent = `Port C:  ${deviceInfo['ports']['C']['action']} ${deviceInfo['ports']['C']['angle']}`;
      this.txt_port_d.textContent = `Port D:  ${deviceInfo['ports']['D']['action']} ${deviceInfo['ports']['D']['angle']}`;
    
    } else {
      this.txt_connected.textContent = 'Disconnected';
    }
  }

  remove() {
    // this.stop_polling = true;
    const model = this.model as MoveHubModel;
    model.stop_polling = true;
  }
   
}
