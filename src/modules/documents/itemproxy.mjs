import { BaseItemHellpiercers } from "./baseitem.mjs"
import { HellpiercersWeapon } from "./weapon.mjs";

/** @type { typeof HellpiercersWeapon | typeof BaseItemHellpiercers } */
export const HellpiercersItemProxy = new Proxy(BaseItemHellpiercers, {
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
