import BluetoothExtensionPlugins from './bluetooth-extension';
import MoveHubExtensionPlugins from './movehub-extension';
import RadiacodeDectectorExtensionPlugins from './radiacode-extension';

const plugins = BluetoothExtensionPlugins.concat(MoveHubExtensionPlugins, RadiacodeDectectorExtensionPlugins);
export default plugins;
    