import { HellpiercersActorSheet } from "./hellpiercers-actor-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class HumanSheet extends HellpiercersActorSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/human/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    abilities: {
      template: "systems/hellpiercers/templates/sheets/human/abilities.hbs",
      scrollable: [""],
    },
    biography: {
      template: "systems/hellpiercers/templates/sheets/actor-biography.hbs",
      scrollable: [""],
    },
    effects: {
      template: "systems/hellpiercers/templates/sheets/actor-effects.hbs",
      scrollable: [""],
    },
  };

  static DEFAULT_OPTIONS = {
    classes: ["human"],
  };

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
    if (partId === "abilities") {
      ctx.weapon = this.actor.system.weapon;
      ctx.armor = this.actor.system.armor;
      ctx.class = this.actor.system.class;
      ctx.weaponChoices = {};
      this.actor.itemTypes.weapon.forEach(w => (ctx.weaponChoices[w.id] = w.name));
    }
    if (partId === "biography") {
      ctx.biography = {
        field: ctx.fields.biography,
        enriched: await TextEditor.enrichHTML(this.actor.system.biography, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
        value: ctx.system.biography,
      };
    }
    if (partId === "effects") ctx.effects = await this._getEffects();
    return ctx;
  }

  async _onItemDrop(uuid) {
    /** @type {import("../documents/index.mjs").HellpiercersItem} */
    const item = await fromUuid(uuid);
    await this.actor.createEmbeddedDocuments("Item", [item.toObject()])
  }
}
