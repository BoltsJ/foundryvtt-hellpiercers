import { HellpiercersItemSheet } from "./hellpiercers-item-sheet.mjs";
import { RangeEditorApp } from "./dialogs/RangeEditorApp.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class ClassSheet extends HellpiercersItemSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/item-header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "systems/hellpiercers/templates/sheets/items/class-details.hbs",
      scrollable: ["tab"],
    },
    effects: { template: "systems/hellpiercers/templates/sheets/item-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["class"],
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
    // if (partId === "details") { }
    if (partId === "effects") ctx.effects = this.item.effects;
    return ctx;
  }

  async _onEditRange(_ev, target) {
    const index = target.dataset.rangeIndex;
    const range = this.item.system.range[index];
    const new_range = await RangeEditorApp.editRange(range);
    const update = { "system.range": this.item.system.range.map(r => r.toObject()) };
    update["system.range"][index] = new_range.toObject();
    await this.item.update(update);
  }
}
