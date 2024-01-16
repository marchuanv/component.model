import {
    ClassMember,
    Container,
    MemberParameter,
    PropertyMember,
    Serialiser
} from '../registry.mjs';
const privateBag = new WeakMap();
export class Model extends Container {
    /**
     * @param { Array<MemberParameter> } memberParameters
    */
    constructor(memberParameters) {
        const targetClass = new.target;
        if (targetClass === Model.prototype) {
            throw new Error('must extend the properties class');
        }
        super(memberParameters);
        const classMember = new ClassMember(targetClass);
        let properties = [];
        while (classMember.next) {
            const property = classMember.child;
            if (property instanceof PropertyMember) {
                properties.push(property);
            }
        }
        properties = properties.reduce((props, prop) => {
            const property = { name: prop.name, get: null, set: null };
            if (!property.get && prop.isGetter) {
                property.get = prop;
            }
            if (!property.set && prop.isSetter) {
                property.set = prop;
            }
            const found = props.find(p => p.name === prop.name);
            if (!found) {
                props.push(property);
            } else {
                if (property.get) {
                    found.get = property.get;
                }
                if (property.set) {
                    found.set = property.set;
                }
            }
            return props;
        }, new Array());
        const bag = {};
        const callbacks = [];
        for (const prop of properties) {
            const propertyName = prop.name;
            const privateKey = `_${propertyName}`;
            const memberParam = super.parameters.find(x => x.name === propertyName);
            if (memberParam) {
                bag[privateKey] = memberParam.value;
            } else {
                bag[privateKey] = null;
            }
            Object.defineProperty(bag, propertyName, {
                get() {
                    return bag[privateKey];
                },
                set(value) {
                    const { callback } = callbacks.find(c => c.key === propertyName) || {};
                    if (callback) {
                        const overwriteValue = callback(value);
                        bag[privateKey] = overwriteValue;
                    } else {
                        bag[privateKey] = value;
                    }
                },
                enumerable: false,
                configurable: false,
            });
        }
        const serialiser = new Serialiser(this, targetClass, Model);
        privateBag.set(this, {
            serialiser,
            properties,
            bag,
            callbacks
        });
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
    */
    set(property, type) {
        const { bag } = privateBag.get(this);
        const key = Object.keys(property)[0];
        const value = property[key];
        if (bag[key] === undefined) {
            throw new Error(`${key} property does not exist`);
        }
        bag[key] = value;
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    get(property, type) {
        const { bag } = privateBag.get(this);
        const key = Object.keys(property)[0];
        return bag[key];
    }
    onSet(property, callback) {
        const { callbacks } = privateBag.get(this);
        const key = Object.keys(property)[0];
        callbacks.push({ key, callback });
    }
    async serialise() {
        const { serialiser } = privateBag.get(this);
        return await serialiser.serialise();
    }
    /**
     * @template T
     * @param { String } data
     * @param { T } Class
     * @returns { T }
     */
    static async deserialise(data, Class) {
        return await Serialiser.deserialise(data, Class, Model);
    }
}