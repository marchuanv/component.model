import {
    MemberParameter,
    Model
} from '../../registry.mjs';
export class Food extends Model {
    /**
     * @param { String } name
     * @param { Boolean } isAdultFood
    */
    constructor(name, isAdultFood) {
        super([
            new MemberParameter({ name }, 'string', false),
            new MemberParameter({ isAdultFood }, 'boolean', false)
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
     * @returns { Boolean }
    */
    get isAdultFood() {
        return super.get({ isAdultFood: null });
    }
    /**
     * @param { Boolean } value
    */
    set isAdultFood(value) {
        super.set({ isAdultFood: value });
    }
}