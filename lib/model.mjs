import {
    Container,
    MemberParameter
} from '../registry.mjs';
const privateBag = new WeakMap();
export class Model extends Container {
    /**
     * @param { Array<MemberParameter> } memberParameters
    */
    constructor(memberParameters) {
        const targetClass = new.target;
        if (targetClass === Model.prototype || targetClass === Model) {
            throw new Error('must extend class with the model class');
        }
        super(memberParameters);
        let properties = super.interface.properties;
        properties = properties.map((prop) => {
            return {
                name: prop.name,
                get: prop.isGetter,
                set: prop.isSetter,
                value: null,
                type: prop.typeDefinition
            };
        });
        for (const param of super.parameters) {
            const existingProperty = properties.find(p => p.name === param.name);
            if (existingProperty) {
                if (existingProperty.type.Id.toString() === param.typeDefinition.Id.toString()) {
                    existingProperty.value = param.value;
                } else {
                    console.log('parameter type definition: ', param.typeDefinition.type);
                    console.log('property type definition: ', existingProperty.type.type);
                    throw new Error(`field: ${param.name}, property: ${existingProperty.name} match, but type definitions are different`);
                }
            } else {
                properties.push({
                    name: param.name,
                    get: true,
                    set: false,
                    value: param.value
                });
            }
        }
        const callbacks = [];
        for (const prop of properties) {
            const propertyName = prop.name;
            const obj = {
                get() {
                    return prop.value;
                },
                set(value) {
                    const { callback } = callbacks.find(c => c.key === propertyName) || {};
                    if (callback) {
                        prop.value = callback(value);
                    } else {
                        prop.value = value;
                    }
                },
                enumerable: false,
                configurable: false,
            };
            if (prop.get && !prop.set) {
                delete obj.set;
            }
            if (!prop.get && prop.set) {
                delete obj.get;
            }
            Object.defineProperty(prop, propertyName, obj);
        }
        privateBag.set(this, { properties, callbacks });
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
        const { properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        const _property = properties.find(x => x[key]);
        return _property.get();
    }
    onSet(property, callback) {
        const { callbacks } = privateBag.get(this);
        const key = Object.keys(property)[0];
        callbacks.push({ key, callback });
    }
}