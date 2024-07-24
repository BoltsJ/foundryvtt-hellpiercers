import { HellpiercersActorSheet } from "./hellpiercers-actor-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class BossSheet extends HellpiercersActorSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/boss/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    abilities: { template: "systems/hellpiercers/templates/sheets/boss/abilities.hbs" },
    biography: { template: "systems/hellpiercers/templates/sheets/actor-biography.hbs" },
    effects: { template: "systems/hellpiercers/templates/sheets/actor-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["boss"],
  };

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
    if (partId === "abilities") {
      ctx.attacks = [];
      for (let attack of this.actor.itemTypes.ability.filter(i => i.system.action === "attack")) {
        const effect = await TextEditor.enrichHTML(this.actor.system.biography, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        });
        ctx.attacks.push({ attack, effect });
      }
      ctx.special = {
        field: ctx.fields.special.fields.effect,
        enriched: await TextEditor.enrichHTML(ctx.system.special.effect, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
        value: ctx.system.special.effect,
      };
      ctx.agnosia = {
        field: ctx.fields.agnosia.fields.effect,
        enriched: await TextEditor.enrichHTML(ctx.system.agnosia.effect, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        }),
        value: ctx.system.agnosia.effect,
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
}
