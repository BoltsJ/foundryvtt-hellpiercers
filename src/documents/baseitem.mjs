export class BaseItemHellpiercers extends Item {
  /** @returns {this is import("./weapon.mjs").HellpiercersWeapon} */
  isWeapon() {
    return false;
  }
}
