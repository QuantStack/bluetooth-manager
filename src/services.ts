export type Service = {
  name: string;
  serviceUUID: string;
};

export const servicesDict: 
    Record<string, Service>
 = {
  GenericAttribute: {
    name: 'Generic attribute service',
    serviceUUID: '00001801-0000-1000-8000-00805f9b34fb',
  },
  GenericAccess: {
    name: 'Generic access service',
    serviceUUID: '00001800-0000-1000-8000-00805f9b34fb',
  },
  Battery: {
    name: 'Battery service',
    serviceUUID: '0000180f-0000-1000-8000-00805f9b34fb',
  },
  MoveHub: {
    name: 'Move hub service',
    serviceUUID: '00001623-1212-efde-1623-785feabcd123',
  },
  HeartRate: {
    name: 'Heart rate service',
    serviceUUID: '0000180d-0000-1000-8000-00805f9b34fb',
  },
  ManufacturerSpecificData: {
    name: 'Manufacturer Specific Data Service',
    serviceUUID: '0000fe0f-0000-1000-8000-00805f9b34fb',
  },
  UnknownFromSmartWatch: {
    name: 'Unknown service from Smart Watch',
    serviceUUID: '6a4e2401-667b-11e3-949a-0800200c9a66',
  },
  LightSource: {
    name: "Light Source",
    serviceUUID:"0000001f-0000-1000-8000-00805f9b34fb"
  },
  Bulb: {
    name: "Bulb",
    serviceUUID: "00000000-0000-1000-8000-00805f9b34fb"
  },
  AudioInputControl  : {
    name: "Audio Input Control Service",
    serviceUUID:"00001843-0000-1000-8000-00805f9b34fb"
  },
  MediaControl : {
    name: "Media Control Service",
    serviceUUID:"00001848-0000-1000-8000-00805f9b34fb"
  },
  UnknownLightBulb1 : {
    name: "Unknown service 1 from Light Bulb",
    serviceUUID: "0000fff6-0000-1000-8000-00805f9b34fb"
  },
  UnknownLightBulb2 : {
    name: "Unknown service 2 from Light Bulb",
    serviceUUID: "06170000-0057-495a-5f53-545f44454d4f"
  },
  UnknownLightBulb3 : {
    name: "Unknown service 3 from Light Bulb",
    serviceUUID: "0000a8b0-5749-5a5f-424c-455f50414952"
  },
  UnknownLightBulb4 : {
    name: "Unknown service 4 from Light Bulb",
    serviceUUID: "06170000-0057-495a-5f42-4c455f4f5441"
  },
  LoudSpeaker1 : {
    name: "Unknown service 1 from Loudspeaker",
    serviceUUID: "0000110b-0000-1000-8000-00805f9b34fb"
  },
  LoudSpeaker2 : {
    name: "Unknown service 2 from Loudspeaker",
    serviceUUID: "0000110c-0000-1000-8000-00805f9b34fb"
  },
  LoudSpeaker3 : {
    name: "Unknown service 3 from Loudspeaker",
    serviceUUID: "0000110e-0000-1000-8000-00805f9b34fb"
  }
 }

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
