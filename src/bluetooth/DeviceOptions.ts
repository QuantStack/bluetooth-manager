export interface DeviceOptions {
  acceptAllDevices: boolean;
  filters?: [
    {
      services?: Array<string>;
      name?: string;
      namePrefix?: string;
    }
  ];

  manufacturerData?: [
    { companyIdentifier?: string; dataPrefix?: string; mask: any }
  ];

  exclusionFilters?: [
    {
      services?: Array<string>;
      name?: string;
      namePrefix?: string;
    }
  ];
  optionalServices?: Array<string>;

  serviceData?: [{ service: string; dataPrefix?: string; mask?: any }];
  optionalManufacturerData?: Array<number>;
}
