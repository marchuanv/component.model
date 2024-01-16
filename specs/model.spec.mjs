import {
    Model
} from '../registry.mjs';
import {
    Dog,
    Food
} from './index.mjs';
describe('when model properties change', () => {
    fit('should sync data', () => {
        const expectedName = 'Parody';
        const expectedAge = 5;
        const food = new Food('epol', true);
        const dog = new Dog(expectedName, expectedAge, 20, food);
        expect(dog.name).toBe(expectedName);
        expect(dog.age).toBe(expectedAge);

        let fireCount = 0;
        dog.onSet({ name: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedName;
        });
        dog.onSet({ age: null }, (value) => {
            fireCount = fireCount + 1;
            return expectedAge;
        });
        dog.age = 25; //onChange
        dog.name = 'Lassy'; //onChange

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
    it('should deserialise', async () => {
        const expectedName = 'Bob';
        const expectedAge = 30;
        const human = new Human(expectedName, expectedAge, 170, 89);
        expect(human.name).toBe(expectedName);
        expect(human.age).toBe(expectedAge);

        const serialised = await human.serialise();
        expect(serialised).toBeDefined();
        expect(serialised).not.toBeNull();

        const humanDeserialised = await Model.deserialise(serialised, Human);
        expect(humanDeserialised).toBeDefined();
        expect(humanDeserialised).not.toBeNull();

    });
});
