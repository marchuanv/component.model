import {
    MemberParameter,
    Model
} from '../../registry.mjs';
import {
    Food
} from '../index.mjs';
export class Animal extends Model {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } weight
     * @param { Food } food
     * @param { String } type
    */
    constructor(name, age, weight, food, type) {
        super([
            new MemberParameter({ name }, String),
            new MemberParameter({ age }, Number),
            new MemberParameter({ weight }, Number),
            new MemberParameter({ food }, Food),
            new MemberParameter({ type }, String)
        ]);
    }
    /**
     * @returns { String }
    */
    get type() {
        return super.get({ type: null });
    }
    /**
     * @param { String } value
    */
    set type(value) {
        super.set({ type: value });
    }
}