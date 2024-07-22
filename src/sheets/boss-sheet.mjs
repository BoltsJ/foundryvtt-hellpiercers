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
    ...super.DEFAULT_OPTIONS,
    classes: ["hellpiercers", "actor", "boss"],
    actions: {
      onEditImage: this.prototype._onEditImage,
      onCreateEmbed: this.prototype._onCreateEmbed,
      onDeleteEmbed: this.prototype._onDeleteEmbed,
      onUpdateEmbed: this.prototype._onUpdateEmbed,
      onEmbedSheet: this.prototype._onEmbedSheet,
    },
  };

  async _prepareContext() {
    const ctx = {
      editable: this.isEditable,
      owner: this.actor.isOwner,
      actor: this.actor,
      system: this.actor.system,
      fields: this.actor.system.schema.fields,
      weapon: this.actor.system.weapon,
      armor: this.actor.system.armor,
      class: this.actor.system.class,
      tabs: this._getTabs(),
    };
    return ctx;
  }

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

  async _getEffects() {
    const ctx = {
      temporary: [],
      items: [],
      effects: [],
    };
    for (let effect of this.actor.allApplicableEffects()) {
      if (effect.parent !== this.actor) ctx.items.push(effect);
      else if (effect.isTemporary) ctx.temporary.push(effect);
      else ctx.effects.push(effect);
    }
    return ctx;
  }
}
