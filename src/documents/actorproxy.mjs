import { HellpiercersActor } from "./baseactor.mjs";
import { DemonActor } from "./demonactor.mjs";
import { HumanActor } from "./human.mjs";

/** @type { typeof HumanActor | typeof DemonActor} */
export const HellpiercersActorProxy = new Proxy(HellpiercersActor, {
  construct(BaseActorHellpiercers, args) {
    switch (args[0]?.type) {
      case "human":
        return new HumanActor(...args);
      case "demon":
        return new DemonActor(...args);
      default:
        break;
    }
    return new BaseActorHellpiercers(...args);
  },
});
