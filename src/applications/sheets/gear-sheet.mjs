import { HellpiercersItemSheet } from "./hellpiercers-item-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class GearSheet extends HellpiercersItemSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/item-header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "systems/hellpiercers/templates/sheets/items/gear-details.hbs",
      scrollable: [""],
    },
    effects: { template: "systems/hellpiercers/templates/sheets/item-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["gear"],
  };

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
      ctx.effect = {
        field: ctx.fields.effect,
        enriched: await TextEditor.enrichHTML(ctx.system.effect, {
          secrets: this.item.isOwner,
          rollData: this.actor?.getRollData.bind(this.actor),
        }),
        value: ctx.system.effect,
      };
    }
    if (partId === "effects") ctx.effects = this.item.effects;
    return ctx;
  }
}
