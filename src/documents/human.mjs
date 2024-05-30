import { BaseActorHellpiercers } from "./baseactor.mjs";

export class HumanActor extends BaseActorHellpiercers {
  get weapon() {
    return this.itemTypes.weapon.find(w => w.id === this.system.weapon);
  }

  get class() {
    return this.getEmbeddedDocument("Item", this.system.class);
  }

  get armor() {
    return this.getEmbeddedDocument("Item", this.system.armor);
  }

  /** @inheritdoc */
  prepareBaseData() {
    super.prepareBaseData();
    this.system.health.max = this.class?.system.health ?? 10;
    this.system.speed = this.armor?.system.speed ?? 3;
  }

  /** @override
   * @returns {this is HumanActor}
   */
  isHuman() {
    return true;
  }
}
