import {
    MemberParameter,
    Properties
} from '../registry.mjs';
describe('when properties change', () => {
    it('should sync data', () => {
        const expectedName = 'Bob';
        const expectedAge = 30;
        const human = new Human(expectedName, expectedAge, 170, 89);
        expect(human.name).toBe(expectedName);
        expect(human.age).toBe(expectedAge);

        let fireCount = 0;
        human.onSet({ name: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedName;
        });
        human.onSet({ age: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedAge;
        });
        human.age = 25; //onChange
        human.name = 'John'; //onChange

        expect(fireCount).toBe(2);
        expect(human.name).toBe(expectedName);
        expect(human.age).toBe(expectedAge);
    });
    it('should serialise', async () => {
        const expectedName = 'Bob';
        const expectedAge = 30;
        const human = new Human(expectedName, expectedAge, 170, 89);
        expect(human.name).toBe(expectedName);
        expect(human.age).toBe(expectedAge);

        const serialised = await human.serialise();
        expect(serialised).toBeDefined();
        expect(serialised).not.toBeNull();
    });
    fit('should deserialise', async () => {
        const expectedName = 'Bob';
        const expectedAge = 30;
        const human = new Human(expectedName, expectedAge, 170, 89);
        expect(human.name).toBe(expectedName);
        expect(human.age).toBe(expectedAge);

        const serialised = await human.serialise();
        expect(serialised).toBeDefined();
        expect(serialised).not.toBeNull();

        const humanDeserialised = await Properties.deserialise(serialised, Human);
        expect(humanDeserialised).toBeDefined();
        expect(humanDeserialised).not.toBeNull();

    });
});

class Human extends Properties {
    /**
     * @param { String } name
     * @param { Number } age
     * @param { Number } height
     * @param { Number } weight
     * @param { Array<String> } parts
     * @param {{ heart: Boolean }} organs
    */
    constructor(name, age, height, weight, parts = ['head', 'feet', 'legs', 'arms'], organs = { heart: true }) {
        super([
            new MemberParameter( { name }),
            new MemberParameter({ age }),
            new MemberParameter({ height }),
            new MemberParameter({ weight }),
            new MemberParameter({ parts }),
            new MemberParameter({ organs })
        ]);
        super.set({ age });
        super.set({ name });
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
}