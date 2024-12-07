import { HellpiercersItemSheet } from "./hellpiercers-item-sheet.mjs";
import { RangeEditor } from "../dialogs/range-editor.mjs";

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
    actions: {
      editRange: this.#editRange,
    },
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

  /** @this WeaponSheet */
  static async #editRange(_ev, target) {
    const index = target.dataset.rangeIndex;
    const range = this.item.system.range[index];
    try {
      const new_range = await RangeEditor.editRange(range);
      const update = { "system.range": this.item.system.range.map(r => r.toObject()) };
      update["system.range"][index] = new_range.toObject();
      await this.item.update(update);
    } catch (e) {
      console.warn("Editing range cancelled");
    }
  }
}
