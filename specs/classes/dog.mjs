import {
    MemberParameter,
    Model
} from '../../registry.mjs';
import {
    Food
} from '../index.mjs';
export class Dog extends Model {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } weight
     * @param { Food } food
    */
    constructor(name, age, weight, food) {
        super([
            new MemberParameter({ name }, 'string', false),
            new MemberParameter({ age }, 'number', false),
            new MemberParameter({ weight }, 'number', false),
            new MemberParameter({ food }, 'Food', true)
        ]);
    }
    /**
     * @returns { String }
    */
    get name() {
        return super.get({ name: null });
    }
    /**
     * @param { String } value
    */
    set name(value) {
        super.set({ name: value });
    }
    /**
     * @returns { Number }
    */
    get age() {
        return super.get({ age: null });
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        super.set({ age: value });
    }
    /**
     * @returns { Number }
    */
    get weight() {
        return super.get({ weight: null });
    }
    /**
     * @param { Number } value
    */
    set weight(value) {
        super.set({ weight: value });
    }
    /**
     * @returns { Food }
    */
    get food() {
        return super.get({ food: null });
    }
    /**
     * @param { Food } value
    */
    set food(value) {
        super.set({ food: value });
    }
}