import { HellpiercersItemSheet } from "./hellpiercers-item-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class AbilitySheet extends HellpiercersItemSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/item-header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "systems/hellpiercers/templates/sheets/items/ability-details.hbs",
      scrollable: ["tab"],
    },
    effects: { template: "systems/hellpiercers/templates/sheets/item-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["ability"],
  };

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
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
