import BatteryGauge from "react-battery-gauge";
import { IMoveHubPanelProps } from "../moveHubPanelView";


const customStyle = {
    width: '100px',
    height: '40px',
    fill: 'pink',
    strokeWidth: 2,
    strokeColor: '#111',
  };

export default function BatteryComponent({ device }: IMoveHubPanelProps) {
    return (
        device.deviceInfo.batteryLevel !== undefined ? (
            <BatteryGauge value={device.deviceInfo.batteryLevel} style={customStyle} />
        ) : (
            <div>No battery level available</div> // Render an appropriate message or empty div if undefined
        )
    );
}