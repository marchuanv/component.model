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
            delete prop.type;
            const propertyName = prop.name;
            if (prop.get) {
                prop.get = () => {
                    return prop.value;
                };
            } else {
                delete prop.get;
            }
            if (prop.set) {
                prop.set = (value) => {
                    const { callback } = callbacks.find(c => c.key === propertyName) || {};
                    if (callback) {
                        prop.value = callback(value);
                    } else {
                        prop.value = value;
                    }
                };
            } else {
                delete prop.set;
            }
            prop.enumerable = false;
            prop.configurable = false;
            const propValue = prop.value;
            delete prop.value;
            Object.defineProperty(prop, propertyName, prop);
            prop.value = propValue;
        }
        privateBag.set(this, { properties, callbacks });
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
    */
    set(property, type) {
        const key = Object.keys(property)[0];
        const { properties } = privateBag.get(this);
        const _property = properties.find(x => x[key]);
        if (_property === undefined) {
            throw new Error(`${key} property does not exist`);
        }
        if (_property.set === undefined) {
            throw new Error(`${key} property does not have a setter`);
        }
        const value = property[key];
        _property.set(value);
    }
    /**
     * @template T
     * @param { Object } property
     * @param { T } type
     * @returns { T }
    */
    get(property, type) {
        const key = Object.keys(property)[0];
        const { properties } = privateBag.get(this);
        const _property = properties.find(x => x[key]);
        if (_property === undefined) {
            throw new Error(`${key} property does not exist`);
        }
        if (_property.get === undefined) {
            throw new Error(`${key} property does not have a getter`);
        }
        return _property.get();
    }
    onSet(property, callback) {
        const { callbacks, properties } = privateBag.get(this);
        const key = Object.keys(property)[0];
        const _property = properties.find(x => x[key]);
        if (_property === undefined) {
            throw new Error(`${key} property does not exist`);
        }
        if (_property.set === undefined) {
            throw new Error(`${key} property does not have a setter`);
        }
        callbacks.push({ key, callback });
    }
}