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
        expect(dog.name).toBe(expectedName);
        expect(dog.age).toBe(expectedAge);
    });
});
