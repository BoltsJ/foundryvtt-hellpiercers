import { HellpiercersItem } from "./baseitem.mjs";
import { HellpiercersWeapon } from "./weapon.mjs";

/** @type { typeof HellpiercersWeapon | typeof HellpiercersItem } */
export const HellpiercersItemProxy = new Proxy(HellpiercersItem, {
  construct(BaseItemHellpiercers, args) {
    switch (args[0]?.type) {
      case "weapon":
        return new HellpiercersWeapon(...args);
      default:
        break;
    }
    return new BaseItemHellpiercers(...args);
  },
});
