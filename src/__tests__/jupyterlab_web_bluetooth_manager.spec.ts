import { DropDownRegistry } from '../bluetooth-extension';
import { BluetoothManager } from '../bluetooth/BluetoothManager';

describe('bluetooh-manager', () => {
  it('should be tested', () => {
    expect(1 + 1).toEqual(2);
  });

  it('adds newly registered device types to the dialog dropdown', () => {
    const bluetoothManager = new BluetoothManager();
    const dropdown = new DropDownRegistry(bluetoothManager.deviceTypeRegistry);

    expect(dropdown.node.querySelectorAll('option')).toHaveLength(0);

    bluetoothManager.deviceTypeRegistry.add({
      deviceType: 'Radiacode® 110',
      options: {
        acceptAllDevices: false,
        filters: [{ services: ['e63215e5-7003-49d8-96b0-b024798fb901'] }],
        optionalServices: ['e63215e5-7003-49d8-96b0-b024798fb901']
      },
      factory: async () => undefined as never
    });

    const options = Array.from(dropdown.node.querySelectorAll('option')).map(
      option => option.textContent
    );

    expect(options).toContain('Radiacode® 110');
  });
});
