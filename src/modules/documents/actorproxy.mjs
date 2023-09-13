import { BaseActorHellpiercers } from "./baseactor.mjs";
import { DemonActor } from "./demonactor.mjs";
import { HellpiercerActor } from "./hellpierceractor.mjs";

/** @type { typeof HellpiercerActor | typeof DemonActor} */
export const HellpiercersActorProxy = new Proxy(BaseActorHellpiercers, {
  construct(_, args) {
    switch (args[0]?.type) {
      case "hellpiercer":
        return new HellpiercerActor(...args);
      case "demon":
        return new DemonActor(...args);
      default:
        break;
    }
    return new _(...args);
  },
});
