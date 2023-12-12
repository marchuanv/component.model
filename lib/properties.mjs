import {
    Bag,
    ClassMember,
    Container,
    MemberParameter,
    ReferenceType
} from '../registry.mjs';
const privateBag = new WeakMap();
class PropertiesMap {
    /**
     * @param { Bag } bag
     */
    constructor(bag) {
        this._bag = bag;
    }
    /**
     * @returns { Bag }
    */
    get bag() {
        return this._bag;
    }
}
export class Properties extends Container {
    /**
     * @param { Array<MemberParameter> } memberParameters
    */
    constructor(memberParameters) {
        const targetClass = new.target;
        if (targetClass === Properties.prototype) {
            throw new Error('must extend the properties class');
        }
        super(memberParameters);
        const referenceTypes = memberParameters.filter(mp => mp.type instanceof ReferenceType && !mp.type.isArray && !mp.type.isObject);
        const classMember = new ClassMember(targetClass);
        const ctorMethod = classMember.find('constructor', false, false, true, true, false);
        if (context) {
            let parentBag = null;
            const { value } = ctorArgs.find(x => x.isContext);
            ({ bag: parentBag } = getPropertiesMap(value));
            let relatedMap = privateBag.get(parentBag);
            if (!relatedMap) {
                const childBag = new Bag(this);
                parentBag.child = childBag;
                if (ctorMethod) {
                    debugger;
                }
                relatedMap = new PropertiesMap(parentBag.first, classMember);
                privateBag.set(parentBag, relatedMap);
            }
            privateBag.set(this, relatedMap);
        } else {
            const thisMap = new PropertiesMap(new Bag(this), classMember);
            if (ctorMethod) {
                debugger;
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
    async deserialise() {
        const { bag, classMember } = getPropertiesMap(this);
        const member = classMember.find('ctor', false, false, true, true);
        const Class = classMember.value;
        const ctor = Class[member.name];
        const ctorArgs = bag.items.filter(i => i.isCtorParam).map(x => x.value);
        return await ctor.call(Class, ...ctorArgs);
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