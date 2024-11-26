export type Service = {
  name: string;
  serviceUUID: string;
  characteristicsUUID: string[];
};

export const servicesDict: 
    Record<string, Service>
 = {
  GenericAttribute: {
    name: 'Generic attribute service',
    serviceUUID: '00001801-0000-1000-8000-00805f9b34fb',
    characteristicsUUID: []
  },
  GenericAccess: {
    name: 'Generic access service',
    serviceUUID: '00001800-0000-1000-8000-00805f9b34fb',
    characteristicsUUID: []
  },
  Battery: {
    name: 'Battery service',
    serviceUUID: '0000180f-0000-1000-8000-00805f9b34fb',
    characteristicsUUID: []
  },
  MoveHub: {
    name: 'Move hub service',
    serviceUUID: '00001623-1212-efde-1623-785feabcd123',
    characteristicsUUID: []
  },
  HeartRate: {
    name: 'Heart rate service',
    serviceUUID: '0000180d-0000-1000-8000-00805f9b34fb',
    characteristicsUUID: []
  },
  ManufacturerSpecificData: {
    name: 'Manufacturer Specific Data Service',
    serviceUUID: '0000fe0f-0000-1000-8000-00805f9b34fb',
    characteristicsUUID: []
  },
  UnknownFromSmartWatch: {
    name: 'Unknown service from Smart Watch',
    serviceUUID: '6a4e2401-667b-11e3-949a-0800200c9a66',
    characteristicsUUID: []
  }
};

/* GAS: Generic Access Service
// service: '00001801-0000-1000-8000-00805f9b34fb,
// characteristics: '00002a00-0000-1000-8000-00805f9b34fb' // Device name characteristics
// characteristics: '00002a05-0000-1000-8000-00805f9b34fb' // Peripheral Preferred Connection Parameters characteristic
// characteristic: '"00002a05-0000-1000-8000-00805f9b34fb' // Service Changed characteristic

/* MoveHub service */
// service: '00001623-1212-efde-1623-785feabcd123';
// characteristics: '00001624-1212-efde-1623-785feabcd123';

/* Heart-rate */
// service: '0000180d-0000-1000-8000-00805f9b34fb';
// characteristics : '00002a37-0000-1000-8000-00805f9b34fb';

/* Battery service */
// service: '0000180f-0000-1000-8000-00805f9b34fb'
// characteristics : '00002a19-0000-1000-8000-00805f9b34fb'

/* Garmin specific service */
// service :'6a4e310-667b-11e3-949a-0800200c9a66'
