import { 
    BagItem,
    EventEmitter, 
    Relation,
    randomUUID
} from '../registry.mjs';

const privateBag = new WeakMap();

class BagMap {
    /**
     * @param { Object } owner
     * @param { String } name
    */
    constructor(owner, name) {
        this._Id = randomUUID();
        this._owner = owner;
        this._name = name;
        this._items = new Array();
    }
    /**
     * @returns { String }
    */
    get Id() {
        return this._Id;
    }
    /**
     * @returns { String }
    */
    get name() {
        return this._name;
    }
    /**
     * @returns { Object }
    */
    get owner() {
        return this._owner;
    }
    /**
     * @returns { Array<BagItem> }
    */
    get items() {
        return this._items;
    }
}

export class Bag extends Relation {
    /**
     * @param { class } owner
    */
    constructor(owner) {
        super();
        if (!owner) {
            throw new Error('owner argument not provided.');
        }
        const thisName = owner.constructor.name;
        if (!thisName) {
            throw new Error('could not determine bag name.');
        }
        privateBag.set(this, new BagMap(
            owner,
            thisName
        ));
        Object.seal(this);
    }
    get Id() {
        const { Id } = getBagMap(this);
        return Id;
    }
    /**
     * @param { String } name
     * @param { Boolean } onceOff
     * @param { Function } callback
    */
    on(name, onceOff, callback) {
        const { items } = getBagMap(this);
        let bagItem = items.find(i => i.name === name);
        if (!bagItem) {
            bagItem = new BagItem(name, value, readOnly);
            items.push(bagItem);
        }
        bagItem.on(onceOff, callback);
    }
    /**
     * @param { Object } _owner
     * @returns { Boolean }
    */
    isOwner(_owner) {
        if (!_owner) {
            throw new Error('_owner argument not provided.');
        }
        const { owner } = getBagMap(this);
        if (owner === _owner) {
            return true;
        }
        return false;
    }
    /**
     * @param { String } name
     * @param { Object } value
     * @param { Boolean } readOnly
    */
    set(name, value, readOnly = false) {
        const { items } = getBagMap(this);
        let bagItem = items.find(i => i.name === name);
        if (bagItem) {
            if (bagItem.readOnly) {
                throw new Error(`${name} is read only`);
            }
        } else {
            bagItem = new BagItem(name, value, readOnly);
            items.push(bagItem);
        }
        bagItem.value = value;
    }
    /**
     * @param { String } name
     * @returns { T }
    */
    get(name) {
        const { items } = getBagMap(this);
        const bagItem = items.find(i => i.name === name);
        if (bagItem) {
            return bagItem.value;
        } else {
            return null;
        }
    }
    /**
     * @returns { Array<BagItem> }
    */
    get items() {
        const { items } = getBagMap(this);
        return items;
    }
}
/**
 * @returns { BagMap }
*/
function getBagMap(context) {
    const obj = privateBag.get(context);
    if (obj instanceof BagMap) {
        return obj;
    }
}