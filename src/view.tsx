import { VDomRenderer } from '@jupyterlab/apputils';
import { BluetoothPanelModel } from './model';
//import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import LegoBoost from 'lego-boost-browser';
import React from 'react';
import { Signal } from '@lumino/signaling';

function ConnectComponent(/*translator: ITranslator*/ ) {
  const list: Array<LegoBoost>=[];
  const [message, setMessage] = React.useState('');
  function handleClick() {
    const boost = new LegoBoost();
    boost.connect();
    console.log('boost:', boost);
    let newMessage = '';
    if (boost.isConnected) newMessage = `Device ID: ${boost.deviceID}`;
    list.push(boost);
    console.log('list:', list)
    setMessage(newMessage);
    return newMessage; // This value is returned but not used directly
  }
  return (
    <>
      <div>
        <button onClick={handleClick}>Connect device</button>
        <p>{message}</p>
      </div>
    </>
  );
}

export class BluetoothPanelView extends VDomRenderer<BluetoothPanelModel> {
  //public translator: ITranslator;
  private newDeviceAdded: Signal<BluetoothPanelView, string>;
  //private listOfConnectedDevice: Array<LegoBoost>;

  constructor(model: BluetoothPanelModel /*, translator: ITranslator*/) {
    super(model);
    //this.translator = translator;
    this.addClass('jp-bluetooth-panel');
    this.newDeviceAdded = new Signal<this, string>(this);
    this.newDeviceAdded.connect(this.onNewDeviceAdded, this);
  }
  // Handler for the signal
  private onNewDeviceAdded(sender: BluetoothPanelView, data: string) {
    console.log('Signal received:', data);
  }

  render() {
    /*const trans = (translator ?? nullTranslator).load(
      'jupyterlab_web_bluetooth_manager'
    );*/
    return (
      <>
        <div>
          <h2>Web bluetooth manager</h2>

          <ConnectComponent></ConnectComponent>
        </div>
      </>
    );
  }
}

/*onClick={() => {
  detectAllDevices()
    .then(result => {
      //do something with result
      console.log('device id', result.id);
      {<h2>Connected devices</h2>}
    })
    .catch(console.error);
}}*/
