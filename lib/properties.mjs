import { Bag, reflection } from '../registry.mjs';
const privateBag = new WeakMap();

class PropertiesMap {
    constructor() {
        this._bag = null;
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
     * @param { { name: String, value: Object } } context
    */
    constructor(context = null) {
        if (context) {
            const { name, value } = context;
            let parentBag = null;
            ({ bag: parentBag } = getPropertiesMap(value));
            let relatedMap = privateBag.get(parentBag);
            if (!relatedMap) {
                const childBag = new Bag(this);
                parentBag.child = childBag;
                childBag.set(name, value, true, true);
                relatedMap = new PropertiesMap();
                relatedMap.bag = parentBag.first;
                privateBag.set(parentBag, relatedMap);
            }
            privateBag.set(this, relatedMap);
        } else {
            const thisMap = new PropertiesMap();
            thisMap.bag = new Bag(this);
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
        bag.on(propertyName, false, isReadOnly, isSerialised, callback);
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
        bag.on(propertyName, true, isReadOnly, isSerialised, callback);
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
        bag.set(propertyName, propertyValue, isReadOnly, isSerialised);
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
     * @returns { T }
    */
    clone(Class) {
        const classInfo = getClassInfo(Class);
        const { bag } = getPropertiesMap(this);
        const deserialised = {};
        for(const info of classInfo){
            const bagItems = bag.items.filter(i => info.properties.find(propName => propName === i.name));
            const ctorParams = reflection.getFunctions(info.Class);
            console.log();
        }
        return deserialised;
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

/**
 * @template T
 * @param { T } Class
 * @returns { Array<T> }
*/
function getClassInfo(Class) {
    const info = {
        Class,
        properties: []
    };
    let classes = [info];
    info.properties = Object.getOwnPropertyNames(Class.prototype)
                        .filter(pName => pName !== 'constructor');
    if (info.Class === Properties) {
        return classes;
    }
    const _class = Object.getPrototypeOf(Class);
    if (!_class || !_class.constructor) {
        throw new Error('critical error');
    }
    const _classes = getClassInfo(_class);
    if (_classes.length > 0) {
        classes = classes.concat(_classes);
    }
    return classes;
}