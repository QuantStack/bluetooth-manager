import { BluetoothManager, IBluetoothManager } from "../../bluetooth/BluetoothManager";
import CopyToClipboard from "./CopyToClipboard";

interface IDeviceListProps {
    bluetoothManager: IBluetoothManager
}

export function MoveHubList({ bluetoothManager }: IDeviceListProps) {
    const listItems = bluetoothManager.deviceList.map((item: BluetoothManager.Device, index) =>
        <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
                <div>Move Hub n°{index + 1}</div> <CopyToClipboard textToCopy={item.native.id} />
            </div>
        </>
    );
    return (
        <ul>{listItems}</ul>
    )
}