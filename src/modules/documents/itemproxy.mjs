/** @type { typeof Human | typeof DemonActor} */
export const HellpiercersItemProxy = new Proxy(BaseItemHellpiercers, {
  construct(BaseItemHellpiercers, args) {
    switch (args[0]?.type) {
      case "hellpiercer":
        return new HumanActor(...args);
      case "demon":
        return new DemonActor(...args);
      default:
        break;
    }
    return new BaseItemHellpiercers(...args);
  },
});
