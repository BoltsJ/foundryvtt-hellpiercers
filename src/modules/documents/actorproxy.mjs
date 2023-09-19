import { BaseActorHellpiercers } from "./baseactor.mjs";
import { DemonActor } from "./demonactor.mjs";
import { HumanActor } from "./hellpierceractor.mjs";

/** @type { typeof Human | typeof DemonActor} */
export const HellpiercersActorProxy = new Proxy(BaseActorHellpiercers, {
  construct(BaseActorHellpiercers, args) {
    switch (args[0]?.type) {
      case "hellpiercer":
        return new HumanActor(...args);
      case "demon":
        return new DemonActor(...args);
      default:
        break;
    }
    return new BaseActorHellpiercers(...args);
  },
});
