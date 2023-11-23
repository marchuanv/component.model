import { BagItem } from "./bag.item.mjs";
export class CtorParam extends BagItem {
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } isContext
    */
    constructor(name, value, isContext = false) {
        super(name, value, true, isContext, true);
        this._isCtorParam = true;
        this._isContext = isContext;
    }
}