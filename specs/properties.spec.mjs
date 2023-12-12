import { ComplexType, TypeMapper } from 'utils';
import { MemberParameter, Properties } from '../registry.mjs';

describe('when properties change', () => {
    it('should sync data', () => {
        const human = new Human('Bob', 30, 170, 89);
        const actualValue = 'ef7cbdeb-6536-4e38-a9e1-cc1acdd00e7d';
        contextRoot.Id = actualValue;
        expect(contextRoot.Id).toBe(actualValue);
        let firedCount = 0;
        contextRoot.onSet({ Id: null }, false, false, (value) => {
            firedCount = firedCount + 1;
            return actualValue;
        });
        const expectedValue = '5a0bf50b-6ba5-4570-984c-cdcada1d19f0';
        contextRoot.Id = expectedValue; //onChange
        expect(firedCount).toBe(1);
        expect(contextRoot.Id).toBe(actualValue);
    });
    it('should sync data within context', () => {
        const contextRoot = new ContextRoot();
        const actualValue = 'b4ad82a4-d76e-4b36-bc4d-f0ca5386622f';
        contextRoot.Id = actualValue;
        expect(contextRoot.Id).toBe(actualValue);
        let firedCount = 0;
        contextRoot.onSet({ Id: null }, false, false, (value) => {
            firedCount = firedCount + 1;
            return actualValue;
        });
        const expectedValue = '1deccbb7-b859-4e77-a1b5-7b5b58ce3b31';
        contextRoot.Id = expectedValue; //onChange
        expect(firedCount).toBe(1);
        expect(contextRoot.Id).toBe(actualValue);
    });
    it('should serialise', () => {

        const expectedId = '484db6d7-7c17-46ce-9b57-888ce835edf7';
        const expectedId1 = 'ef7cbdeb-6536-4e38-a9e1-cc1acdd00e7d';
        const expectedId2 = '00584b74-bb02-4284-b40a-5c69c928cba9';

        const contextRoot = new ContextRoot();
        contextRoot.Id = expectedId;

        const contextA = new ContextA({ contextRoot });
        contextA.Id = expectedId1;

        const contextB = new ContextB({ contextRoot });
        contextB.Id = expectedId2;

        const contextASerialised = contextA.serialise();
        expect(contextASerialised).toBe(JSON.stringify({ contextRoot: { Id: expectedId }, Id: expectedId2 }));

        const contextBSerialised = contextB.serialise();
        expect(contextBSerialised).toBe(JSON.stringify({ contextRoot: { Id: expectedId }, Id: expectedId2 }));
    });
    it('should share properties with same context', () => {

        const contextRoot = new ContextRoot();
        contextRoot.Id = '653ef45a-14ba-400b-a1a9-c0695d6b1f06';

        const contextA = new ContextA({ contextRoot });
        contextA.Id = '250b70e1-fe1f-47eb-8185-04278ddef1bc';

        const contextB = new ContextB({ contextA });
        contextB.Id = 'c0785886-6652-4308-aab5-b96b15eb942e';

        const contextC = new ContextC({ contextA });
        contextC.Id = 'a70b6d9a-6e3b-40d3-a1b5-08327d1cd6e2';

        expect(contextRoot.Id).not.toBe(contextA.Id);
        expect(contextRoot.Id).not.toBe(contextB.Id);
        expect(contextRoot.Id).not.toBe(contextC.Id);

        expect(contextA.Id).not.toBe(contextB.Id);
        expect(contextA.Id).not.toBe(contextC.Id);

        expect(contextB.Id).toBe(contextC.Id); //they share a context
        expect(contextC.Id).toBe(contextB.Id); //they share a context
    });
    it('should deserialise', async () => {

        const contextD = new ContextD('Hello World')
        contextD.Id = 'e742b112-1363-49f2-84dd-5e2e2c8dabe5';

        const deserialised = await contextD.deserialise();
        
        expect(deserialised).toBeDefined();
        expect(deserialised.Id).not.toBe(contextD.Id);

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
            new MemberParameter( { name }, new TypeMapper(PrimitiveType.String)),
            new MemberParameter({ age }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ height }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ weight }, new TypeMapper(PrimitiveType.Number)),
            new MemberParameter({ parts }, new TypeMapper(ComplexType.StringArray)),
            new MemberParameter({ organs }, new TypeMapper(ComplexType.Object))
        ]);
        this._age = age;
    }
    /**
     * @returns { Number }
    */
    get age() {
        return this._age;
    }
    /**
     * @param { Number } value
    */
    set age(value) {
        this._age = value;
    }
    /**
     * @param { Number } age
     * @param { Array<String> } parts
     * @param { Number } height
     * @param { Number } weight
     * @param {{ heart: Boolean }} organs
     * @returns { Human }
    */
    static create(age = 1, parts = ['head', 'feet', 'legs', 'arms'], height, weight, organs = { heart: true }) {
    }
}

class Baby extends Human {
    /**
     * @param { String } name
    */
    constructor(name) {
        super(name, 1, 49, 3.3);
        this._name = name;
    }
    /**
     * @returns { String }
    */
    get name() {
        return this._name;
    }
    /**
     * @param { String } value
    */
    set name(value) {
        this._name = value;
    }
    /**
     * @param { Number } age
    */
    setAge(age) {
        super.age = age;
    }
}