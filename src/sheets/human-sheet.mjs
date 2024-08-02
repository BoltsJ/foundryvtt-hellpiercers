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
      ctx.class_active = {
        item: this.actor.system.class_active,
        enriched: await TextEditor.enrichHTML(ctx.system.class_active?.system.effect, {
          secrets: this.document.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
      };
      ctx.class_passive = {
        item: this.actor.system.class_passive,
        enriched: await TextEditor.enrichHTML(ctx.system.class_passive?.system.effect, {
          secrets: this.document.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
      };
      ctx.class_limit = {
        item: this.actor.system.class_limit,
        enriched: await TextEditor.enrichHTML(ctx.system.class_limit?.system.effect, {
          secrets: this.document.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
      };
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
    const [created] = await this.actor.createEmbeddedDocuments("Item", [item.toObject()]);
    if (created.type === "class") {
      await this.actor.system.class?.delete();
      await this.actor.update({ "system.class": created });
    }
    if (created.type === "armor") {
      await this.actor.system.armor?.delete();
      await this.actor.update({ "system.armor": created });
    }
    if (created.type === "ability") {
      const prop = `${created.system.item.type}_${created.system.action}`;
      await this.actor.system[prop]?.delete();
      await this.actor.update({ [`system.${prop}`]: created });
    }
  }
}
