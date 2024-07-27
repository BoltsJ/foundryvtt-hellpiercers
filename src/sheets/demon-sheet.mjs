import { RangeEditorApp } from "./dialogs/RangeEditorApp.mjs";
import { HellpiercersActorSheet } from "./hellpiercers-actor-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class DemonSheet extends HellpiercersActorSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/demon/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    abilities: { template: "systems/hellpiercers/templates/sheets/demon/abilities.hbs" },
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
    classes: ["demon"],
    actions: {
      editRange: this.prototype._onEditRange,
    },
  };

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
    if (partId === "abilities") {
      ctx.strike = {
        field: ctx.fields.strike.fields.description,
        enriched: await TextEditor.enrichHTML(this.actor.system.strike.description, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
        value: ctx.system.strike.description,
      };
      ctx.special = {
        field: ctx.fields.special.fields.description,
        enriched: await TextEditor.enrichHTML(this.actor.system.special.description, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
        value: ctx.system.special.description,
      };
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

  async _onEditRange() {
    const range = this.document.system.strike.range;
    const new_range = await RangeEditorApp.editRange(range);
    const update = { "system.strike.range": new_range };
    await this.document.update(update);
  }
}
