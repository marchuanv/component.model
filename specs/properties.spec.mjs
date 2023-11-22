import { Properties } from '../registry.mjs';
class Context extends Properties {
    get Id() {
        return super.get({ Id: null }, String.prototype);
    }
    set Id(value) {
        super.set({ Id: value }, false, true);
    }
}
class ContextRoot extends Context { }
class ContextA extends Context { }
class ContextB extends Context { }
class ContextC extends Context { }

describe('when properties change', () => {
    it('should sync data', () => {
        const contextRoot = new ContextRoot();
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

        const contextA = new ContextA({ name: 'contextRoot', value: contextRoot });
        contextA.Id = expectedId1;

        const contextB = new ContextB({ name: 'contextRoot', value: contextRoot });
        contextB.Id = expectedId2;

        const contextASerialised = contextA.serialise();
        expect(contextASerialised).toBe(JSON.stringify({ contextRoot: { Id: expectedId }, Id: expectedId2 }));

        const contextBSerialised = contextB.serialise();
        expect(contextBSerialised).toBe(JSON.stringify({ contextRoot: { Id: expectedId }, Id: expectedId2 }));
    });
    it('should share properties with same context', () => {

        const context = new ContextRoot();
        context.Id = '653ef45a-14ba-400b-a1a9-c0695d6b1f06';

        const contextA = new ContextA({ name: 'contextRoot', value: context });
        contextA.Id = '250b70e1-fe1f-47eb-8185-04278ddef1bc';

        const contextB = new ContextB({ name: 'contextA', value: contextA });
        contextB.Id = 'c0785886-6652-4308-aab5-b96b15eb942e';

        const contextC = new ContextC({ name: 'contextA', value: contextA });
        contextC.Id = 'a70b6d9a-6e3b-40d3-a1b5-08327d1cd6e2';

        expect(context.Id).not.toBe(contextA.Id);
        expect(context.Id).not.toBe(contextB.Id);
        expect(context.Id).not.toBe(contextC.Id);

        expect(contextA.Id).not.toBe(contextB.Id);
        expect(contextA.Id).not.toBe(contextC.Id);

        expect(contextB.Id).toBe(contextC.Id); //they share a context
        expect(contextC.Id).toBe(contextB.Id); //they share a context
    });
    fit('should clone', () => {

        const expectedId = '95e3435e-afa1-4f2d-8de8-6aa16373a375';

        const contextA = new ContextA();
        contextA.Id = expectedId;

        const clonedContextA = contextA.clone(ContextA);

        expect(clonedContextA).toBeInstanceOf(ContextA);
    });
});