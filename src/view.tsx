import { VDomRenderer } from '@jupyterlab/apputils';
import { BluetoothPanelModel } from './model';
//import { ITranslator, nullTranslator } from '@jupyterlab/translation';
import LegoBoost from 'lego-boost-browser';
//import React from 'react';

interface IConnectComponentProps {
  model: BluetoothPanelModel;
}

function ConnectComponent(props: IConnectComponentProps) {
  const list = props.model.devicesList;

  function handleClick() {
    console.log('You are trying to connect a device');
    const boost = new LegoBoost();
    boost.connect();
    list.push(boost);
    props.model.devicesList = list;
    props.model.stateChanged.emit();
  }
  return (
    <>
      <div>
        <button onClick={handleClick}>Connect device</button>
      </div>
    </>
  );
}
function DisconnectLastAddedComponent(props: IConnectComponentProps) {
  const list = props.model.devicesList;

  function handleClick() {
    console.log('You are trying to disconnect last added device');
    if (list.length > 0) {
      const boost = list[list.length];
      console.log('Trying to disconnect, list:', list);
      boost.disconnect();
      list.pop();
    } else {
      console.warn('There is no device connected');
      return;
    }
    props.model.devicesList = list;
    props.model.stateChanged.emit();
  }

  return (
    <>
      <div>
        <button onClick={handleClick}> Disconnect last added device</button>
      </div>
    </>
  );
}

export class BluetoothPanelView extends VDomRenderer<BluetoothPanelModel> {
  constructor(model: BluetoothPanelModel) {
    super(model);
    this.addClass('jp-bluetooth-panel');
    this.model = model;
  }

  render() {
    return (
      <>
        <div>
          <h2>Web bluetooth manager</h2>
          <ConnectComponent model={this.model}></ConnectComponent>
          <DisconnectLastAddedComponent
            model={this.model}
          ></DisconnectLastAddedComponent>
        </div>
      </>
    );
  }
}
