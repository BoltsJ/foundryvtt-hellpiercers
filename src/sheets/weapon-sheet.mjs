import { HellpiercersItemSheet } from "./hellpiercers-item-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class WeaponSheet extends HellpiercersItemSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/item-header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "systems/hellpiercers/templates/sheets/items/weapon-details.hbs",
      scrollable: ["tab"],
    },
    effects: { template: "systems/hellpiercers/templates/sheets/item-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["weapon"],
  };

  async _prepareContext() {
    const ctx = {
      editable: this.isEditable,
      owner: this.item.isOwner,
      item: this.item,
      system: this.item.system,
      fields: this.item.system.schema.fields,
      tabs: this._getTabs(),
    };
    return ctx;
  }

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
    if (partId === "header") {
      ctx.description = {
        field: ctx.fields.description,
        enriched: await TextEditor.enrichHTML(ctx.system.description, {
          secrets: this.item.isOwner,
          rollData: this.actor?.getRollData.bind(this.actor),
        }),
        value: ctx.system.description,
      };
    }
    if (partId === "details") {
      ctx.active = {
        field: ctx.fields.active.fields.description,
        enriched: await TextEditor.enrichHTML(ctx.system.active.description, {
          secrets: this.item.isOwner,
          rollData: this.actor?.getRollData.bind(this.actor),
        }),
        value: ctx.system.active.description,
      };
      ctx.passive = {
        field: ctx.fields.passive.fields.description,
        enriched: await TextEditor.enrichHTML(ctx.system.passive.description, {
          secrets: this.item.isOwner,
          rollData: this.actor?.getRollData.bind(this.actor),
        }),
        value: ctx.system.passive.description,
      };
    }
    if (partId === "effects") ctx.effects = this.item.effects;
    return ctx;
  }
}
