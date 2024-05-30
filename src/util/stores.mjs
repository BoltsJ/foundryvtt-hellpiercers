import { writable } from "svelte/store";

export class TabStore {
  /** @type {Map<string, import("svelte/store").Writable<string>>} */
  static #stores = new Map();

  /**
   * @param {string} key
   * @param {string} [def=undefined]
   */
  static get(key, def = undefined) {
    if (!this.#stores.has(key)) this.#stores.set(key, writable(def));
    return this.#stores.get(key);
  }
}
