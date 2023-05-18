import { assert } from "../assert/assert";
import { ObjectEntries } from "../object/object";

export class Collection<K extends PropertyKey, I> {
  private _items: Record<K, I>;
  private _itemOrder: K[];

  public constructor(public keyGenerator?: (item: I) => K) {
    this._items = {} as Record<K, I>;
    this._itemOrder = [];
  }

  public append(item: I, key?: K): K {
    if (key === undefined) {
      if( this.keyGenerator === undefined) {
        throw "No key or key generator specified. Specify a key, or a key-generator in the construction of this Collection or provide the keys manually with the set() function.";
      }
      key = this.keyGenerator(item);
    }
    assert(this._items[key] === undefined, `key (${String(key)}) already exists`)
    this._items[key] = item;
    this._itemOrder.push(key)
    return key;
  }

  public prepend(item: I, key?: K): K {
    if (key === undefined) {
      if( this.keyGenerator === undefined) {
        throw "No key or key generator specified. Specify a key, or a key-generator in the construction of this Collection or provide the keys manually with the set() function.";
      }
      key = this.keyGenerator(item);
    }
    assert(this._items[key] === undefined, `key (${String(key)}) already exists`)
    this._items[key] = item;
    this._itemOrder.unshift(key)
    return key;
  }

  public overwrite(key: K, item: I): void {
    assert(this._items[key] !== undefined, `key (${String(key)}) does not exist`)
    this._items[key] = item;
  }

  public set(key: K, item: I): void {
    if(this._items[key] !== undefined){
      this.insert(item, key);
    }
    else{
      this._items[key] = item;
    }
  }

  public insert(item: I, key?: K): K {
    if (key === undefined) {
      if( this.keyGenerator === undefined) {
        throw "No key or key generator specified. Specify a key, or a key-generator in the construction of this Collection or provide the keys manually with the set() function.";
      }
      key = this.keyGenerator(item);
    }
    assert(this._items[key] === undefined, `key (${String(key)}) already exists`)
    this._items[key] = item;
    this._itemOrder.push(key)
    return key;
  }

  public get(key: K): I | null {
    if (this._items[key]) {
      return this._items[key];
    }
    return null;
  }

  public delete(key: K): I | null {
    const item = this._items[key];
    if (item) {
      delete this._items[key];
      return item;
    }
    return null;
  }

  public clear(): number {
    const itemCount = this._itemOrder.length;
    this._items = {} as Record<K, I>;
    this._itemOrder = [];
    return itemCount;
  }

  public count(): number {
    return this._itemOrder.length;
  }

  public keyOf(item: I): K | null {
    return this.entries().find(([_key, _item]) => _item === item)?.[0] ?? null;
  }

  public keys(): K[] {
    return this._itemOrder;
  }

  public items(): I[] {
    return Object.values(this._items);
  }

  public entries(): [K, I][] {
    return ObjectEntries(this._items);
  }

  public forEach(func: (item: I) => void): void {
    this.items().forEach(func);
  }

  public forEachKey(func: (key: K) => void): void {
    this.keys().forEach(func);
  }

  public forEachEntry(func: (entry: [K, I], index: number) => void): void {
    this.entries().forEach(func);
  }

  public map<T>(func: (item: I) => T): Collection<K, T> {
    const mappedCollection = new Collection<K, T>();
    this.forEachEntry(([key, item]) => {
      mappedCollection.set(key, func(item));
    });
    return mappedCollection;
  }

  public find(func: (item: I) => boolean): I | null {
    return this.items().find(func) ?? null;
  }

  public filter(func: (item: I, index: number) => boolean): Collection<K, I> {
    const filteredCollection = new Collection<K, I>(this.keyGenerator);
    this.forEachEntry(([key, item], index) => {
      if (func(item, index)) {
        filteredCollection.set(key, item);
      }
    });
    return filteredCollection;
  }

  public reduce(
    func: (value: I, item: I, index: number, items: I[]) => I,
    startValue?: I
  ): I;

  public reduce<T>(
    func: (value: T, item: I, index: number, items: I[]) => T,
    startValue: T
  ): T;

  public reduce<T>(
    func: (value: T, item: I, index: number, items: I[]) => T,
    startValue: T | undefined
  ): T {
    if (startValue !== undefined) {
      return this.items().reduce(func, startValue);
    } else {
      startValue = this.items()[0] as unknown as T;
      return this.items()
        .filter((_, index) => index !== 0) // Quatsch
        .reduce(func, startValue);
    }
  }
}
