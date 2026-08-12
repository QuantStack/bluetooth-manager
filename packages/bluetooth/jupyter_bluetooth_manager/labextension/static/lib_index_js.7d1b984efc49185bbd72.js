"use strict";
(self["webpackChunk_bluetooth_manager_bluetooth"] = self["webpackChunk_bluetooth_manager_bluetooth"] || []).push([["lib_index_js"],{

/***/ "./lib/BluetoothDeviceRunningItem.js"
/*!*******************************************!*\
  !*** ./lib/BluetoothDeviceRunningItem.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BluetoothDeviceRunningItem: () => (/* binding */ BluetoothDeviceRunningItem),
/* harmony export */   disconnect: () => (/* binding */ disconnect)
/* harmony export */ });
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./icon */ "./lib/icon.js");
/* harmony import */ var _BluetoothManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BluetoothManager */ "./lib/BluetoothManager.js");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_2__);



const disconnect = 'bluetooth-manager:disconnect-device';
class BluetoothDeviceRunningItem {
    constructor(device, bluetoothManager, commands) {
        this._device = device;
        this.bluetoothManager = bluetoothManager;
        if (this._device.native.name) {
            const deviceName = this._device.native.name;
            this.className = 'jp-bluetooth-' + deviceName.replace(/\s+/g, '-');
        }
        this.commands = commands;
    }
    open() {
        const commands = this.commands;
        const deviceID = this._device.native.id;
        const menu = new _lumino_widgets__WEBPACK_IMPORTED_MODULE_2__.Menu({ commands: commands });
        this._device.contextCommands.map((command) => {
            menu.addItem({ command: command, args: { deviceID } });
        });
        menu.addClass('jp-bluetooth-device-running-item-menu');
        const deviceElement = document.querySelector(`.${this.className}`);
        if (deviceElement) {
            const rect = deviceElement.getBoundingClientRect();
            const x = rect.left;
            const y = rect.bottom;
            menu.open(x, y);
        }
    }
    icon() {
        return _icon__WEBPACK_IMPORTED_MODULE_0__.BluetoothConnectIcon;
    }
    label() {
        //return this._device.native.name+ '\u00A0'.repeat(30) + this._device.native.id;
        return this._device.native.name + ' (' + this._device.native.id + ')';
    }
    labelTitle() {
        const title = (0,_BluetoothManager__WEBPACK_IMPORTED_MODULE_1__.buildCompleteIdentifier)(this._device.native);
        return title;
    }
    shutdown() {
        this.bluetoothManager.disconnect(this._device);
    }
}


/***/ },

/***/ "./lib/BluetoothManager.js"
/*!*********************************!*\
  !*** ./lib/BluetoothManager.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BluetoothManager: () => (/* binding */ BluetoothManager),
/* harmony export */   IBluetoothManager: () => (/* binding */ IBluetoothManager),
/* harmony export */   buildCompleteIdentifier: () => (/* binding */ buildCompleteIdentifier)
/* harmony export */ });
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/signaling */ "webpack/sharing/consume/default/@lumino/signaling");
/* harmony import */ var _lumino_signaling__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_signaling__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @lumino/coreutils */ "webpack/sharing/consume/default/@lumino/coreutils");
/* harmony import */ var _lumino_coreutils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_lumino_coreutils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @jupyterlab/apputils */ "webpack/sharing/consume/default/@jupyterlab/apputils");
/* harmony import */ var _jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__);



function buildCompleteIdentifier(native) {
    var _a;
    const identifier = ((_a = native.name) === null || _a === void 0 ? void 0 : _a.replace(/\s+/g, '-')) + '-' + native.id;
    return identifier;
}
/**
 * A class used to update the list of connected devices and the related signals used to rerender the connected devices section.
 */
class BluetoothManager {
    constructor() {
        this.deviceListChanged = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        this._deviceTypeRegistry = new BluetoothManager.DeviceTypeRegistry();
        this._deviceList = [];
        this._identifierRegistry = [];
    }
    get deviceList() {
        return this._deviceList;
    }
    get deviceTypeRegistry() {
        return this._deviceTypeRegistry;
    }
    async connect(registryItem) {
        const native = await this.requestDevice(registryItem);
        if (native) {
            const device = await registryItem.factory(native);
            if (device && device.isConnected) {
                this._addDeviceToList(device);
                device.disconnected.connect(async () => {
                    this._removeDeviceFromList(device);
                });
                return device;
            }
        }
    }
    async disconnect(device) {
        await device.disconnect();
        device.dispose();
    }
    // Method to add a device to the list
    _addDeviceToList(device) {
        const identifier = buildCompleteIdentifier(device.native);
        if (this._identifierRegistry.includes(identifier) === false) {
            this._deviceList.push(device);
            this._identifierRegistry.push(identifier);
        }
        else {
            console.warn('The device is already in the registry of identifiers');
        }
        // Emit the signal when the list changes
        this.deviceListChanged.emit(this._deviceList);
    }
    // Method to remove a device from the list
    _removeDeviceFromList(device) {
        const index = this._deviceList.indexOf(device);
        if (index > -1) {
            this._deviceList.splice(index, 1);
            this._identifierRegistry.splice(index, 1);
            // Emit the signal when the list changes
            this.deviceListChanged.emit(this._deviceList);
        }
        device.dispose();
    }
    removeAllDevices() {
        this._deviceList.forEach((device, index) => {
            this._removeDeviceFromList(device);
            this.deviceListChanged.emit(this._deviceList);
        });
    }
    async checkWebBluetoothSupport() {
        const isWebBluetoothSupported = navigator.bluetooth ? true : false;
        if (isWebBluetoothSupported === false) {
            (0,_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.showDialog)({
                title: 'Error',
                body: 'Web Bluetooth is not supported on your browser. It works on Chrome and Edge (Firefox and Explorer are not supported). \n Please also check that the Web Bluetooth flag is properly set to enabled in the Chrome flags (chrome://flags/).',
                buttons: [_jupyterlab_apputils__WEBPACK_IMPORTED_MODULE_2__.Dialog.okButton({ label: 'Close' })]
            });
        }
        return isWebBluetoothSupported;
    }
    async requestDevice(registryItem) {
        const isWebBluetoothSupported = await this.checkWebBluetoothSupport();
        if (isWebBluetoothSupported) {
            const native = await navigator.bluetooth.requestDevice(registryItem.options);
            return native;
        }
        else {
            return;
        }
    }
}
(function (BluetoothManager) {
    /* A class for device using the native bluetoothDevice from the web bluetooth API*/
    class Device {
        constructor(native) {
            this.connected = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
            this.disconnected = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
            this.isConnected = false;
            this.isDisposed = false;
            this.native = native;
            this.contextCommands = ['bluetooth-manager:disconnect-device'];
        }
        async connectAndGetAllServices() {
            this.native.addEventListener('gattserverdisconnected', event => {
                this.isConnected = false;
                this.disconnected.emit(true);
            });
            const server = this.native.gatt;
            if (server) {
                const timeout = 5000;
                const connectWithTimeout = new Promise((resolve, reject) => {
                    const timeoutId = setTimeout(() => {
                        reject(new Error('Connection to GATT server timed out'));
                        server.disconnect();
                        this.dispose();
                    }, timeout);
                    server
                        .connect()
                        .then(async () => {
                        clearTimeout(timeoutId);
                        resolve();
                        this.isConnected = true;
                        this.connected.emit(true);
                    })
                        .catch(error => {
                        server.disconnect();
                        reject(error);
                    });
                });
                await connectWithTimeout;
                if (server.connected === true) {
                    const services = await server.getPrimaryServices();
                    if (!services || services.length === 0) {
                        throw new Error('Server exists but no service found on the device.');
                    }
                    else {
                        return services;
                    }
                }
                else {
                    throw new Error('There is no connection to server. No attempt to get a service.');
                }
            }
            else {
                throw new Error('Server is not defined.');
            }
        }
        async disconnect() {
            var _a;
            if (this.native) {
                (_a = this.native.gatt) === null || _a === void 0 ? void 0 : _a.disconnect();
                this.isConnected = false;
            }
        }
        async getService(selectedServiceUUID) {
            const services = await this.connectAndGetAllServices();
            if (services) {
                const selectedService = services.find(service => service.uuid === selectedServiceUUID);
                return selectedService;
            }
            else {
                throw new Error('Services could not be reached.');
            }
        }
        async getAllCharacteristics(serviceUUID) {
            const service = await this.getService(serviceUUID);
            if (service) {
                return service.getCharacteristics();
            }
            else {
                throw new Error('The requested service is not available.');
            }
        }
        async getCharacteristic(serviceUUID, characteristicUUID) {
            const service = await this.getService(serviceUUID);
            if (service) {
                return service.getCharacteristic(characteristicUUID);
            }
            else {
                throw new Error('The requested service is not available.');
            }
        }
        dispose() {
            if (this.isDisposed) {
                return;
            }
            this.isDisposed = true;
            _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal.clearData(this);
        }
    }
    BluetoothManager.Device = Device;
    class DeviceTypeRegistry {
        constructor() {
            this._deviceTypes = [];
            this._added = new _lumino_signaling__WEBPACK_IMPORTED_MODULE_0__.Signal(this);
        }
        add(registryItem) {
            this._deviceTypes.push(registryItem);
            this._added.emit(registryItem);
        }
        get deviceTypes() {
            return this._deviceTypes;
        }
        get added() {
            return this._added;
        }
    }
    BluetoothManager.DeviceTypeRegistry = DeviceTypeRegistry;
})(BluetoothManager || (BluetoothManager = {}));
const IBluetoothManager = new _lumino_coreutils__WEBPACK_IMPORTED_MODULE_1__.Token('@jupyterlab/bluetooth:manager');


/***/ },

/***/ "./lib/DropDownRegistry.js"
/*!*********************************!*\
  !*** ./lib/DropDownRegistry.js ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DropDownRegistry: () => (/* binding */ DropDownRegistry)
/* harmony export */ });
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @lumino/widgets */ "webpack/sharing/consume/default/@lumino/widgets");
/* harmony import */ var _lumino_widgets__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_lumino_widgets__WEBPACK_IMPORTED_MODULE_0__);

class DropDownRegistry extends _lumino_widgets__WEBPACK_IMPORTED_MODULE_0__.Widget {
    constructor(registry) {
        super();
        this._selectList = document.createElement('select');
        this.node.appendChild(this._selectList);
        this.registry = registry;
        registry.deviceTypes.forEach(item => {
            const option = document.createElement('option');
            option.value = item.deviceType;
            option.text = item.deviceType;
            this._selectList.appendChild(option);
        });
    }
    getValue() {
        return this._selectList.value;
    }
}


/***/ },

/***/ "./lib/icon.js"
/*!*********************!*\
  !*** ./lib/icon.js ***!
  \*********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BluetoothConnectIcon: () => (/* binding */ BluetoothConnectIcon),
/* harmony export */   BluetoothDisconnectIcon: () => (/* binding */ BluetoothDisconnectIcon)
/* harmony export */ });
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @jupyterlab/ui-components */ "webpack/sharing/consume/default/@jupyterlab/ui-components");
/* harmony import */ var _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _style_icons_bluetoothConnect_svg__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../style/icons/bluetoothConnect.svg */ "./style/icons/bluetoothConnect.svg");
/* harmony import */ var _style_icons_bluetoothDisconnect_svg__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../style/icons/bluetoothDisconnect.svg */ "./style/icons/bluetoothDisconnect.svg");



const BluetoothConnectIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: '@jupyterlab/bluetooh-manager:bluetooth-connect',
    svgstr: _style_icons_bluetoothConnect_svg__WEBPACK_IMPORTED_MODULE_1__
});
const BluetoothDisconnectIcon = new _jupyterlab_ui_components__WEBPACK_IMPORTED_MODULE_0__.LabIcon({
    name: '@jupyterlab/bluetooh-manager:bluetooth-disconnect',
    svgstr: _style_icons_bluetoothDisconnect_svg__WEBPACK_IMPORTED_MODULE_2__
});


/***/ },

/***/ "./lib/index.js"
/*!**********************!*\
  !*** ./lib/index.js ***!
  \**********************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BluetoothConnectIcon: () => (/* reexport safe */ _icon__WEBPACK_IMPORTED_MODULE_3__.BluetoothConnectIcon),
/* harmony export */   BluetoothDeviceRunningItem: () => (/* reexport safe */ _BluetoothDeviceRunningItem__WEBPACK_IMPORTED_MODULE_1__.BluetoothDeviceRunningItem),
/* harmony export */   BluetoothDisconnectIcon: () => (/* reexport safe */ _icon__WEBPACK_IMPORTED_MODULE_3__.BluetoothDisconnectIcon),
/* harmony export */   BluetoothManager: () => (/* reexport safe */ _BluetoothManager__WEBPACK_IMPORTED_MODULE_0__.BluetoothManager),
/* harmony export */   DropDownRegistry: () => (/* reexport safe */ _DropDownRegistry__WEBPACK_IMPORTED_MODULE_2__.DropDownRegistry),
/* harmony export */   IBluetoothManager: () => (/* reexport safe */ _BluetoothManager__WEBPACK_IMPORTED_MODULE_0__.IBluetoothManager),
/* harmony export */   buildCompleteIdentifier: () => (/* reexport safe */ _BluetoothManager__WEBPACK_IMPORTED_MODULE_0__.buildCompleteIdentifier),
/* harmony export */   disconnect: () => (/* reexport safe */ _BluetoothDeviceRunningItem__WEBPACK_IMPORTED_MODULE_1__.disconnect)
/* harmony export */ });
/* harmony import */ var _BluetoothManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BluetoothManager */ "./lib/BluetoothManager.js");
/* harmony import */ var _BluetoothDeviceRunningItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./BluetoothDeviceRunningItem */ "./lib/BluetoothDeviceRunningItem.js");
/* harmony import */ var _DropDownRegistry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./DropDownRegistry */ "./lib/DropDownRegistry.js");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./icon */ "./lib/icon.js");







/***/ },

/***/ "./style/icons/bluetoothConnect.svg"
/*!******************************************!*\
  !*** ./style/icons/bluetoothConnect.svg ***!
  \******************************************/
(module) {

module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\n\n<svg\n   fill=\"#000000\"\n   height=\"32\"\n   width=\"32\"\n   version=\"1.1\"\n   id=\"Capa_1\"\n   viewBox=\"0 0 8.69996 8.69996\"\n   xml:space=\"preserve\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"><defs\n   id=\"defs1187\" />\n\n<g\n   id=\"g1182\"\n   style=\"fill:#616161;fill-opacity:1;stroke:none;stroke-opacity:1\"\n   transform=\"matrix(0.04,0,0,0.04,2.1102966e-5,-4.7788924e-5)\">\n\t<path\n   d=\"m 123.264,108.749 45.597,-44.488 c 1.736,-1.693 2.715,-4.016 2.715,-6.441 0,-2.425 -0.979,-4.748 -2.715,-6.441 L 118.823,2.559 c -2.591,-2.528 -6.444,-3.255 -9.78,-1.853 -3.336,1.406 -5.505,4.674 -5.505,8.294 v 80.504 l -42.331,-41.3 c -3.558,-3.471 -9.255,-3.402 -12.727,0.156 -3.471,3.558 -3.401,9.256 0.157,12.727 l 48.851,47.663 -48.851,47.663 c -3.558,3.471 -3.628,9.169 -0.157,12.727 3.471,3.558 9.17,3.628 12.727,0.156 l 42.331,-41.3 V 208.5 c 0,3.62 2.169,6.888 5.505,8.294 1.128,0.476 2.315,0.706 3.493,0.706 2.305,0 4.572,-0.886 6.287,-2.559 l 50.038,-48.82 c 1.736,-1.693 2.715,-4.016 2.715,-6.441 0,-2.425 -0.979,-4.748 -2.715,-6.441 z m -1.725,-78.395 28.15,27.465 -28.15,27.465 z m 0,156.789 v -54.93 l 28.15,27.465 z\"\n   id=\"path1180\"\n   style=\"fill:#616161;fill-opacity:1;stroke:none;stroke-opacity:1\" />\n</g></svg>\n";

/***/ },

/***/ "./style/icons/bluetoothDisconnect.svg"
/*!*********************************************!*\
  !*** ./style/icons/bluetoothDisconnect.svg ***!
  \*********************************************/
(module) {

module.exports = "<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"no\"?>\n<!-- Uploaded to: SVG Repo, www.svgrepo.com, Generator: SVG Repo Mixer Tools -->\n\n<svg\n   fill=\"#000000\"\n   height=\"32\"\n   width=\"32\"\n   version=\"1.1\"\n   id=\"Capa_1\"\n   viewBox=\"0 0 8.69996 8.69996\"\n   xml:space=\"preserve\"\n   xmlns=\"http://www.w3.org/2000/svg\"\n   xmlns:svg=\"http://www.w3.org/2000/svg\"><defs\n   id=\"defs1187\" />\n\n<g\n   id=\"g1182\"\n   style=\"fill:#616161;fill-opacity:1;stroke:none;stroke-opacity:1\"\n   transform=\"matrix(0.04,0,0,0.04,-1.0874739,-4.7788924e-5)\">\n\t<path\n   d=\"m 123.264,108.749 45.597,-44.488 c 1.736,-1.693 2.715,-4.016 2.715,-6.441 0,-2.425 -0.979,-4.748 -2.715,-6.441 L 118.823,2.559 c -2.591,-2.528 -6.444,-3.255 -9.78,-1.853 -3.336,1.406 -5.505,4.674 -5.505,8.294 v 80.504 l -42.331,-41.3 c -3.558,-3.471 -9.255,-3.402 -12.727,0.156 -3.471,3.558 -3.401,9.256 0.157,12.727 l 48.851,47.663 -48.851,47.663 c -3.558,3.471 -3.628,9.169 -0.157,12.727 3.471,3.558 9.17,3.628 12.727,0.156 l 42.331,-41.3 V 208.5 c 0,3.62 2.169,6.888 5.505,8.294 1.128,0.476 2.315,0.706 3.493,0.706 2.305,0 4.572,-0.886 6.287,-2.559 l 50.038,-48.82 c 1.736,-1.693 2.715,-4.016 2.715,-6.441 0,-2.425 -0.979,-4.748 -2.715,-6.441 z m -1.725,-78.395 28.15,27.465 -28.15,27.465 z m 0,156.789 v -54.93 l 28.15,27.465 z\"\n   id=\"path1180\"\n   style=\"fill:#616161;fill-opacity:1;stroke:none;stroke-opacity:1\" />\n</g><g\n   id=\"g1832\"\n   transform=\"matrix(1.2,0,0,1.2,-1.7826254,-2.8055852)\"\n   style=\"stroke-width:0.661916;stroke-miterlimit:4;stroke-dasharray:none\"><path\n     style=\"fill:#616161;fill-opacity:1;stroke:#616161;stroke-width:0.661916;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\"\n     d=\"M 6.4430846,3.3682562 C 8.3303252,5.1706904 8.3303252,5.1706904 8.3303252,5.1706904\"\n     id=\"path1179\" /><path\n     style=\"fill:#616161;fill-opacity:1;stroke:#616161;stroke-width:0.661916;stroke-linecap:butt;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1\"\n     d=\"M 6.4544298,5.1876934 C 8.3416704,3.3852593 8.3416704,3.3852593 8.3416704,3.3852593\"\n     id=\"path1179-6\" /></g></svg>\n";

/***/ }

}]);
//# sourceMappingURL=lib_index_js.7d1b984efc49185bbd72.js.map