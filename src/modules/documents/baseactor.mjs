export class BaseActorHellpiercers extends Actor {
    /**
     * @param {string | Item} weapon
     */
  async equipWeapon(weapon) {
    /** @type {Item} */
    const item = typeof weapon === "string" ? this.getEmbeddedDocument("Item", weapon) : weapon;
    if (!item) return this;
    const updates = this.items
      .filter(i => i.type === "weapon")
      .map(i => ({ _id: i.id, "system.equipped": i === item }));
    return this.updateEmbeddedDocuments("Item", updates);
  }

    /**
     * @param {string | Item} armor
     */
  async equipArmor(armor) {
    /** @type {Item} */
    const item = typeof armor === "string" ? this.getEmbeddedDocument("Item", armor) : armor;
    if (!item) return this;
    const updates = this.items
      .filter(i => i.type === "armor")
      .map(i => ({ _id: i.id, "system.equipped": i === item }));
    return this.updateEmbeddedDocuments("Item", updates);
  }

    /**
     * @param {string | Item} class_item
     */
  async equipClass(class_item) {
    /** @type {Item} */
    const item = typeof class_item === "string" ? this.getEmbeddedDocument("Item", class_item) : class_item;
    if (!item) return this;
    const updates = this.items
      .filter(i => i.type === "class")
      .map(i => ({ _id: i.id, "system.equipped": i === item }));
    return this.updateEmbeddedDocuments("Item", updates);
  }

}
