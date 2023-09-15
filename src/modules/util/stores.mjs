import { writable } from "svelte/store";

export class TabStore {
  static stores = new Map();
  static get(key, def = undefined) {
    if (!this.stores.has(key)) this.stores.set(key, writable(def));
    return this.stores.get(key);
  }
}
