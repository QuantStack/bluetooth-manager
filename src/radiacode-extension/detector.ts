import { BluetoothManager } from "../bluetooth/BluetoothManager";


export class RadiacodeDetector extends BluetoothManager.Device {
    constructor(native: BluetoothDevice) {
        super(native);
    }
}