import { EventEmitter } from "utils";

export class BagItem {
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } readOnly
     * @param { Boolean } isSerialise
    */
    constructor(name, value, readOnly = true, isSerialised = false) {
        this._name = name;
        this._value = value;
        this._readOnly = readOnly;
        this._eventEmitter = new EventEmitter();
        this._isSerialised = isSerialised;
        this._type = typeof value;
    }
    /**
     * @returns { String }
    */
    get name() {
        return this._name;
    }
    /**
     * @returns { Object }
    */
    get value() {
        return this._value;
    }
    /**
     * @param { Object } value
    */
    set value(value) {
        this._value = value;
        this._eventEmitter.emit(this._name, value);
    }
    /**
     * @returns { Boolean }
    */
    get readOnly() {
        return this._readOnly;
    }
    /**
     * @param { Boolean } value
    */
    set readOnly(value) {
        this._readOnly = value;
    }
    /**
     * @returns { String }
    */
    get type() {
        return this._type;
    }
    /**
     * @returns { Boolean }
    */
    get isSerialised() {
        return this._isSerialised;
    }
    /**
     * @param { String } name
     * @param { Boolean } onceOff
     * @param { Function } callback
    */
    on(onceOff, callback) {
        if (onceOff) {
            this._eventEmitter.once(this._name, async (value) => {
                const newValue = callback(value);
                this._value = newValue;
            });
        } else {
            this._eventEmitter.on(this._name, async (value) => {
                const newValue = callback(value);
                this._value = newValue;
            });
        }
    }
}