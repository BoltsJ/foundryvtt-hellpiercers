import { BaseActorHellpiercers } from "./baseactor.mjs";

export class HellpiercerActor extends BaseActorHellpiercers {
  get weapon() {
    return this.items.find(i => i.type === "weapon" && i.system.equipped);
  }

  get class() {
    return this.items.find(i => i.type === "class" && i.system.equipped);
  }

  get armor() {
    return this.items.find(i => i.type === "armor" && i.system.equipped);
  }

  /** @override */
  isHellpiercer() {
    return true;
  }
}
