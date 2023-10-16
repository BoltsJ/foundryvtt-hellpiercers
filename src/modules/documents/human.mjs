import { BaseActorHellpiercers } from "./baseactor.mjs";

export class HumanActor extends BaseActorHellpiercers {
  get weapon() {
    return this.items.find(i => i.type === "weapon" && i.system.active);
  }

  get class() {
    return this.items.find(i => i.type === "class");
  }

  get armor() {
    return this.items.find(i => i.type === "armor");
  }

  /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();
    this.system.updateSource({ "health.max": this.class?.system.health ?? 10 });
    this.system.updateSource({ speed: this.armor?.system.speed ?? 3 });
  }

  /** @override
   * @returns {this is HumanActor}
   */
  isHuman() {
    return true;
  }
}
