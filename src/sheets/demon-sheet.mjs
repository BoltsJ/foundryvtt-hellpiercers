import { HellpiercersActorSheet } from "./hellpiercers-actor-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class DemonSheet extends HellpiercersActorSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/demon/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    abilities: { template: "systems/hellpiercers/templates/sheets/demon/abilities.hbs" },
    biography: { template: "systems/hellpiercers/templates/sheets/actor-biography.hbs" },
    effects: { template: "systems/hellpiercers/templates/sheets/actor-effects.hbs" },
  };

  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
    classes: ["hellpiercers", "actor", "demon"],
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
