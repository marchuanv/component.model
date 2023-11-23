

import { Bag, CtorParam } from '../registry.mjs';
const privateBag = new WeakMap();
class PropertiesMap {
    constructor() {
        this._bag = null;
        this._ctorArgs = [];
    }
    /**
     * @returns { Bag }
    */
    get bag() {
        return this._bag;
    }
    /**
     * @param { Bag }
    */
    set bag(value) {
        this._bag = value;
    }
}

export class Properties {
    /**
     * @param { Array<CtorParam> } ctorArgs
    */
    constructor(ctorArgs = []) {
        if (ctorArgs.find(x => x.isContext)) {
            let parentBag = null;
            const { value } = ctorArgs.find(x => x.isContext);
            ({ bag: parentBag } = getPropertiesMap(value));
            let relatedMap = privateBag.get(parentBag);
            if (!relatedMap) {
                const childBag = new Bag(this);
                parentBag.child = childBag;
                for(const arg of ctorArgs) {
                    childBag.set(arg.name, arg.value, true, false, true, true);
                }
                relatedMap = new PropertiesMap();
                relatedMap.bag = parentBag.first;
                privateBag.set(parentBag, relatedMap);
            }
            privateBag.set(this, relatedMap);
        } else {
            const thisMap = new PropertiesMap();
            thisMap.bag = new Bag(this);
            for(const { name, value } of ctorArgs) {
                thisMap.bag.set(name, value, true, false, true, false);
            }
            privateBag.set(this, thisMap);
        }
        Object.seal(this);
    }
    /**
     * @param { Object } property
     * @param { Boolean } isReadOnly
     * @param { Boolean } isSerialised
     * @param { Function } callback
    */
    onSet(property, isReadOnly, isSerialised, callback) {
        const { bag } = getPropertiesMap(this);
        const propertyName = Object.keys(property)[0];
        bag.on(propertyName, false, isReadOnly, isSerialised, false, false, callback);
    }
    /**
      * @param { Object } property
      * @param { Boolean } isReadOnly
      * @param { Boolean } isSerialised
      * @param { Function } callback
     */
    onceSet(property, isReadOnly, isSerialised, callback) {
        const { bag } = getPropertiesMap(this);
        const propertyName = Object.keys(property)[0];
        bag.on(propertyName, true, isReadOnly, isSerialised, false, false, callback);
    }
    /**
     * @param { Object } property
     * @param { Boolean } isReadOnly
     * @param { Boolean } isSerialised
    */
    set(property, isReadOnly, isSerialised) {
        const { bag } = getPropertiesMap(this);
        const propertyName = Object.keys(property)[0];
        const propertyValue = property[propertyName];
        bag.set(propertyName, propertyValue, isReadOnly, isSerialised, false, false);
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    get(property, type) {
        const { bag } = getPropertiesMap(this);
        const propertyName = Object.keys(property)[0];
        return bag.get(propertyName);
    }
    serialise() {
        const { bag } = getPropertiesMap(this);
        const serialised = {};
        for (const { name, value, type } of bag.items.filter(i => i.isSerialised)) {
            if (type === 'string' || type === 'number' || type === 'boolean') {
                serialised[name] = value;
            } else {
                if (value instanceof Properties) {
                    const serialisedStr = value.serialise();
                    serialised[name] = JSON.parse(serialisedStr);
                } else {
                    const serialisedStr = JSON.stringify(value);
                    serialised[name] = JSON.parse(serialisedStr);
                }
            }
        }
        return JSON.stringify(serialised);
    }
    /**
     * @template T
     * @param { T } Class
     * @returns { Properties }
    */
    clone(Class) {
        const { bag } = getPropertiesMap(this);
        const ctorArgs = bag.items.filter(bi => bi.isCtorParam).map(bi => bi.value);
        const instance = Reflect.construct(Class, ctorArgs);
        return instance;
    }
}
/**
 * @returns { PropertiesMap }
*/
function getPropertiesMap(context) {
    const obj = privateBag.get(context);
    if (obj instanceof PropertiesMap) {
        return obj;
    }
}