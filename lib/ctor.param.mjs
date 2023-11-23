import { BagItem } from "./bag.item.mjs";
export class CtorParam extends BagItem {
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } readOnly
     * @param { Boolean } isSerialise
     * @param { Boolean } isContext
    */
    constructor(name, value, readOnly, isSerialise, isContext) {
        super(name, value, readOnly, isSerialise, true, isContext);
    }
}