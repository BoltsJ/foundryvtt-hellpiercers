import { HellpiercersActorSheet } from "./hellpiercers-actor-sheet.mjs";

/**
 * @typedef {import("../documents/index.mjs").HellpiercersActor} HellpiercersActor
 */

export class BossSheet extends HellpiercersActorSheet {
  static PARTS = {
    header: { template: "systems/hellpiercers/templates/sheets/boss/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    abilities: {
      template: "systems/hellpiercers/templates/sheets/boss/abilities.hbs",
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
    classes: ["boss"],
    actions: {
      addAbility: this.prototype._onAddAbility,
    },
  };

  async _preparePartContext(partId, ctx) {
    if (Object.keys(ctx.tabs).includes(partId)) ctx.tab = ctx.tabs[partId];
    if (partId === "abilities") {
      ctx.attacks = [];
      for (let attack of this.actor.system.attacks) {
        const effect = await TextEditor.enrichHTML(attack.system.effect, {
          secrets: this.actor.isOwner,
          rollData: this.actor.getRollData.bind(this.actor),
        });
        ctx.attacks.push({ attack, effect });
      }
      ctx.special = ctx.system.special;
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

  async _onAddAbility() {
    const buttons = [{ label: "Cancel", action: "cancel", default: true }];

    if (this.actor.system.attacks.length < 3)
      buttons.unshift({ label: "HELLPIERCERS.ITEM.action.attack", action: "attack" });
    if (!this.actor.system.special)
      buttons.unshift({ label: "HELLPIERCERS.ITEM.action.special", action: "special" });

    const ability_type = await foundry.applications.api.DialogV2.wait({
      window: { title: "HELLPIERCERS.DIALOG.new_ability.title" },
      classes: ["hellpiercers", "new-ability"],
      content: game.i18n.localize("HELLPIERCERS.DIALOG.new_ability.content"),
      buttons,
      rejectClose: false,
    });
    let data;
    if (ability_type === "special")
      data = { name: "New Special", type: "ability", "system.action": "special" };
    if (ability_type === "attack")
      data = { name: "New Attack", type: "ability", "system.action": "attack" };
    if (!data) return;

    const [created] = await this.actor.createEmbeddedDocuments("Item", [data]);
    if (ability_type === "special") await this.actor.update({ "system.special": created });
    else if (ability_type === "attack")
      await this.actor.update({
        "system.attacks": [...this.actor.system.attacks.map(a => a.id), created],
      });
    created.sheet.render(true);
  }
}
