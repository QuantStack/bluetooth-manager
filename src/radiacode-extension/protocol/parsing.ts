/**
 * Extracted parsing utilities from radiacode.js from https://github.com/bsharper/radiacode.js
 * Handles binary data parsing for RadiaCode device protocol
 */

/**
 * BytesBuffer - A utility class for handling binary data similar to the Python version
 */
export class BytesBuffer {
  data: Uint8Array;
  position: number = 0;

  constructor(data: Uint8Array | ArrayBuffer) {
    if (data instanceof ArrayBuffer) {
      this.data = new Uint8Array(data);
    } else {
      this.data = data;
    }
    this.position = 0;
  }

  read(length: number): Uint8Array {
    if (this.position + length > this.data.length) {
      throw new Error('Insufficient data in buffer');
    }
    const result = this.data.slice(this.position, this.position + length);
    this.position += length;
    return result;
  }

  readUint8(): number {
    const result = this.data[this.position];
    this.position += 1;
    return result;
  }

  readInt8(): number {
    const result = this.data[this.position];
    this.position += 1;
    return result > 127 ? result - 256 : result;
  }

  readUint16LE(): number {
    const result =
      (this.data[this.position + 1] << 8) | this.data[this.position];
    this.position += 2;
    return result;
  }

  readInt16LE(): number {
    const result =
      (this.data[this.position + 1] << 8) | this.data[this.position];
    this.position += 2;
    return result > 32767 ? result - 65536 : result;
  }

  readUint32LE(): number {
    const result =
      (this.data[this.position + 3] << 24) |
      (this.data[this.position + 2] << 16) |
      (this.data[this.position + 1] << 8) |
      this.data[this.position];
    this.position += 4;
    return result >>> 0; // Convert to unsigned
  }

  readInt32LE(): number {
    const result =
      (this.data[this.position + 3] << 24) |
      (this.data[this.position + 2] << 16) |
      (this.data[this.position + 1] << 8) |
      this.data[this.position];
    this.position += 4;
    return result;
  }

  readFloatLE(): number {
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    for (let i = 0; i < 4; i++) {
      view.setUint8(i, this.data[this.position + i]);
    }
    this.position += 4;
    return view.getFloat32(0, true); // true = little endian
  }

  readString(): string {
    const length = this.readUint8();
    const bytes = this.read(length);
    const decoder = new TextDecoder('ascii');
    return decoder.decode(bytes);
  }

  remaining(): number {
    return this.data.length - this.position;
  }

  size(): number {
    return this.data.length - this.position;
  }

  getBytes(): Uint8Array {
    return this.data;
  }
}

/**
 * Command types (from Python implementation)
 */
export enum COMMAND {
  GET_STATUS = 0x0005,
  SET_EXCHANGE = 0x0007,
  GET_VERSION = 0x000a,
  GET_SERIAL = 0x000b,
  FW_IMAGE_GET_INFO = 0x0012,
  FW_SIGNATURE = 0x0101,
  RD_HW_CONFIG = 0x0807,
  RD_VIRT_SFR = 0x0824,
  WR_VIRT_SFR = 0x0825,
  RD_VIRT_STRING = 0x0826,
  WR_VIRT_STRING = 0x0827,
  RD_VIRT_SFR_BATCH = 0x082a,
  WR_VIRT_SFR_BATCH = 0x082b,
  RD_FLASH = 0x081c,
  SET_TIME = 0x0a04
}

/**
 * Virtual String command IDs
 */
export enum VS {
  CONFIGURATION = 2,
  SERIAL_NUMBER = 8,
  TEXT_MESSAGE = 0xf,
  DATA_BUF = 0x100,
  SFR_FILE = 0x101,
  SPECTRUM = 0x200,
  SPEC_ACCUM = 0x201,
  ENERGY_CALIB = 0x202
}

/**
 * Virtual Special Function Register IDs (VSFR)
 */
export enum VSFR {
  DEVICE_CTRL = 0x0500,
  DEVICE_LANG = 0x0502,
  DEVICE_ON = 0x0503,
  DEVICE_TIME = 0x0504,

  DISP_CTRL = 0x0510,
  DISP_BRT = 0x0511,
  DISP_CONTR = 0x0512,
  DISP_OFF_TIME = 0x0513,
  DISP_ON = 0x0514,
  DISP_DIR = 0x0515,
  DISP_BACKLT_ON = 0x0516,

  SOUND_CTRL = 0x0520,
  SOUND_VOL = 0x0521,
  SOUND_ON = 0x0522,
  SOUND_BUTTON = 0x0523,

  VIBRO_CTRL = 0x0530,
  VIBRO_ON = 0x0531,

  LEDS_CTRL = 0x0540,
  LED0_BRT = 0x0541,
  LED1_BRT = 0x0542,
  LED2_BRT = 0x0543,
  LED3_BRT = 0x0544,
  LEDS_ON = 0x0545,

  ALARM_MODE = 0x05e0,
  PLAY_SIGNAL = 0x05e1,

  MS_CTRL = 0x0600,
  MS_MODE = 0x0601,
  MS_SUB_MODE = 0x0602,
  MS_RUN = 0x0603,

  BLE_TX_PWR = 0x0700,

  DR_LEV1_uR_h = 0x8000,
  DR_LEV2_uR_h = 0x8001,
  DS_LEV1_100uR = 0x8002,
  DS_LEV2_100uR = 0x8003,
  DS_UNITS = 0x8004,
  CPS_FILTER = 0x8005,
  RAW_FILTER = 0x8006,
  DOSE_RESET = 0x8007,
  CR_LEV1_cp10s = 0x8008,
  CR_LEV2_cp10s = 0x8009,

  USE_nSv_h = 0x800c,

  CHN_TO_keV_A0 = 0x8010,
  CHN_TO_keV_A1 = 0x8011,
  CHN_TO_keV_A2 = 0x8012,
  CR_UNITS = 0x8013,
  DS_LEV1_uR = 0x8014,
  DS_LEV2_uR = 0x8015,

  CPS = 0x8020,
  DR_uR_h = 0x8021,
  DS_uR = 0x8022,

  TEMP_degC = 0x8024,
  ACC_X = 0x8025,
  ACC_Y = 0x8026,
  ACC_Z = 0x8027,
  OPT = 0x8028,

  RAW_TEMP_degC = 0x8033,
  TEMP_UP_degC = 0x8034,
  TEMP_DN_degC = 0x8035,

  VBIAS_mV = 0xc000,
  COMP_LEV = 0xc001,
  CALIB_MODE = 0xc002,
  DPOT_RDAC = 0xc004,
  DPOT_RDAC_EEPROM = 0xc005,
  DPOT_TOLER = 0xc006,

  SYS_MCU_ID0 = 0xffff0000,
  SYS_MCU_ID1 = 0xffff0001,
  SYS_MCU_ID2 = 0xffff0002,

  SYS_DEVICE_ID = 0xffff0005,
  SYS_SIGNATURE = 0xffff0006,
  SYS_RX_SIZE = 0xffff0007,
  SYS_TX_SIZE = 0xffff0008,
  SYS_BOOT_VERSION = 0xffff0009,
  SYS_TARGET_VERSION = 0xffff000a,
  SYS_STATUS = 0xffff000b,
  SYS_MCU_VREF = 0xffff000c,
  SYS_MCU_TEMP = 0xffff000d,
  SYS_FW_VER_BT = 0xffff010
}

/**
 * Control flags used for sound/vibration controllers
 */
export enum CTRL {
  BUTTONS = 1 << 0,
  CLICKS = 1 << 1,
  DOSE_RATE_ALARM_1 = 1 << 2,
  DOSE_RATE_ALARM_2 = 1 << 3,
  DOSE_RATE_OUT_OF_SCALE = 1 << 4,
  DOSE_ALARM_1 = 1 << 5,
  DOSE_ALARM_2 = 1 << 6,
  DOSE_OUT_OF_SCALE = 1 << 7
}

/**
 * Display direction enum
 */
export enum DisplayDirection {
  AUTO = 0,
  RIGHT = 1,
  LEFT = 2
}

/**
 * Utility function to create a DataView from array buffer at offset
 */
export function createDataView(data: Uint8Array, offset: number = 0): DataView {
  return new DataView(
    data.buffer,
    data.byteOffset + offset,
    data.byteLength - offset
  );
}

/**
 * Helper to build a packet header
 * @param command Command ID
 * @param sequence Sequence number (0x80-0x9F)
 * @returns Uint8Array with command header
 */
export function buildCommandHeader(
  command: number,
  sequence: number
): Uint8Array {
  const header = new Uint8Array(4);
  const view = new DataView(header.buffer);
  view.setUint16(0, command, true); // Command (little-endian)
  view.setUint8(2, 0); // Reserved
  view.setUint8(3, sequence); // Sequence number
  return header;
}

/**
 * Helper to build a complete packet with payload length header
 * @param command Command ID
 * @param sequence Sequence number
 * @param args Command arguments (optional)
 * @returns Complete packet as Uint8Array
 */
export function buildPacket(
  command: number,
  sequence: number,
  args?: Uint8Array
): Uint8Array {
  const argsBytes = args || new Uint8Array(0);
  const payloadLength = 4 + argsBytes.length; // header + args

  const packet = new Uint8Array(4 + payloadLength);
  const view = new DataView(packet.buffer);

  // Payload length (little-endian)
  view.setUint32(0, payloadLength, true);

  // Command header
  const header = buildCommandHeader(command, sequence);
  packet.set(header, 4);

  // Command data
  packet.set(argsBytes, 8);

  return packet;
}

/**
 * Parse response packet and extract payload
 * @param response Uint8Array response data
 * @returns BytesBuffer positioned at start of payload (after header)
 */
export function parseResponsePacket(response: Uint8Array): BytesBuffer {
  const buffer = new BytesBuffer(response);

  // Read and validate header
  const commandEcho = buffer.readUint16LE();
  const reserved = buffer.readUint8();
  const sequence = buffer.readUint8();

  console.log(
    `Received response: commandEcho=0x${commandEcho.toString(16)}, reserved=${reserved}, sequence=0x${sequence.toString(16)}`
  );

  // Remaining data is the response payload
  return buffer;
}
