import { ClassMember, Container, MemberSchema } from '../registry.mjs';
const privateBag = new WeakMap();

/**
 * @param { Object } context
 * @returns { ClassMember }
*/
function getClassMember(context) {
    return privateBag.get(context);
}

export class Serialiser {
    /**
     * @param { ClassMember } classMember
    */
    constructor(classMember) {
        privateBag.set(this, classMember);
    }
    /**
     * @param { Container } container
    */
    serialise(container) {
        const obj = {};
        const classMember = getClassMember(this);
        while(classMember.next) {
            const member = classMember.child;
            const property = container.properties.find(prop =>
                prop.name === member.name &&
                member.isProperty &&
                member.isGetter
            );
            if (type === 'string' || type === 'number' || type === 'boolean' || type === 'array') {
                obj[property.name] = property.value;
            } else {
                const serialisedStr = JSON.stringify(property.value);
                obj[property.name] = JSON.parse(serialisedStr);
            }
        }
        return JSON.stringify(obj);
    }
    /**
     * @param { MemberSchema } schema
     * @param { Object } data
     * @returns { Container }
    */
    deserialise(schema, data) {
        const classMember = getClassMember(this);
        const ctorMethod = classMember.find('constructor', false, false, true, true, false);
        const args = ctorMethod.parameters.map(p => p.name === )
        return 
    }
}