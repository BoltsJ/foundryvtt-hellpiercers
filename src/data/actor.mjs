import { Range } from "./range-model.mjs";

const fields = foundry.data.fields;

class OwnedItemField extends fields.ForeignDocumentField {
  /** @override */
  constructor(options = {}) {
    super(Item, options);
  }

  /** @override */
  // eslint-disable-next-line no-unused-vars
  initialize(value, model, _options = {}) {
    if (this.idOnly || !model?.parent) return value;
    let parent = model.parent;
    while (parent && !(parent instanceof foundry.abstract.Document)) parent = parent.parent;
    return () => parent?.getEmbeddedDocument("Item", value) ?? null;
  }
}

export class HumanModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ACTOR"];
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true }),
      faction: new fields.StringField({}),
      tags: new fields.SetField(new fields.StringField(), { initial: ["Tag"] }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        max: new fields.NumberField({ integer: true }),
      }),
      scale: new fields.NumberField({ initial: 1, integer: true }),
      speed: new fields.NumberField({ integer: true }),
      actions: new fields.NumberField({ initial: 1, integer: true }),
      pronouns: new fields.StringField({ required: true }),
      callsign: new fields.StringField({ required: true }),
      // Equipment
      class: new OwnedItemField({ initial: null, nullable: true }),
      armor: new OwnedItemField({ initial: null, nullable: true }),
      weapon: new OwnedItemField({ initial: null, nullable: true }),
      abilities: new fields.SchemaField({
        class: new fields.SchemaField({
          active: new OwnedItemField({ initial: null, nullable: true }),
          passive: new OwnedItemField({ initial: null, nullable: true }),
          limit: new OwnedItemField({ initial: null, nullable: true }),
        }),
        armor: new fields.SchemaField({
          movement: new OwnedItemField({ initial: null, nullable: true }),
          ability: new OwnedItemField({ initial: null, nullable: true }),
          reversal: new OwnedItemField({ initial: null, nullable: true }),
        }),
      }),
      meta: new fields.SchemaField({
        cross_class: new fields.BooleanField({ required: true, initial: false }),
        gear_slots: new fields.NumberField({ required: true, initial: 0, integer: true }),
        limit_break: new fields.BooleanField({ required: true, initial: false }),
        weapon_slots: new fields.NumberField({ required: true, initial: 1, integer: true }),
      }),
    };
  }

  prepareBaseData() {
    this.health.max = this.class?.system.health ?? 10;
    this.speed = this.armor?.system?.speed ?? 3;
  }

  async applyClass(cls) {
    const actor = this.parent;
    if (typeof cls === "string") cls = actor?.getEmbeddedDocument("Item", cls);
    if (!cls || !actor || cls.actor !== actor) return;
    const active_data = (await fromUuid(cls.system.active))?.toObject();
    const passive_data = (await fromUuid(cls.system.passive))?.toObject();
    const limit_data = (await fromUuid(cls.system.limit))?.toObject();
    await Promise.allSettled(
      actor.itemTypes.ability.filter(i => i.system.item.type === "class").map(i => i.delete())
    );
    const [active, passive, limit] = await actor.createEmbeddedDocuments("Item", [
      active_data,
      passive_data,
      limit_data,
    ]);
    return actor.update({
      system: { class: cls, "abilities.class": { active, passive, limit } },
    });
  }

  async applyArmor(armor) {
    const actor = this.parent;
    if (typeof armor === "string") armor = actor?.getEmbeddedDocument("Item", armor);
    if (!armor || !actor || armor.actor !== actor) return;
    const movement_data = (await fromUuid(armor.system.movement))?.toObject();
    const ability_data = (await fromUuid(armor.system.ability))?.toObject();
    const reversal_data = (await fromUuid(armor.system.reversal))?.toObject();
    await Promise.allSettled(
      actor.itemTypes.ability.filter(i => i.system.item.type === "armor").map(i => i.delete())
    );
    const [movement, ability, reversal] = await actor.createEmbeddedDocuments("Item", [
      movement_data,
      ability_data,
      reversal_data,
    ]);
    return actor.update({
      system: { armor, "abilities.armor": { movement, ability, reversal } },
    });
  }
}

export class DemonModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ACTOR"];
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true }),
      faction: new fields.StringField({}),
      tags: new fields.SetField(new fields.StringField(), { initial: ["Tag"] }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        max: new fields.NumberField({ required: true, initial: 10, integer: true }),
      }),
      scale: new fields.NumberField({ integer: true, initial: 1, nullable: false }),
      speed: new fields.NumberField({ required: true, initial: 4, integer: true }),
      actions: new fields.NumberField({ initial: 1, integer: true }),
      strike: new fields.SchemaField({
        name: new fields.StringField({ initial: "Strike" }),
        range: new fields.EmbeddedDataField(Range, {
          initial: { kind: "targets", value: 1, modifiers: { range: 0 } },
        }),
        damage: new fields.StringField({
          required: true,
          initial: "3",
          validate: v => foundry.dice.Roll.validate(v),
          validationError: "must be a valid Roll formula",
        }),
        description: new fields.HTMLField({ required: true }),
      }),
      special: new fields.SchemaField({
        name: new fields.StringField({ initial: "Special" }),
        description: new fields.HTMLField({ required: true }),
      }),
    };
  }

  // prepareBaseData() {
  //   if (this.tags.has("Horde")) {
  //     this.health.max = this.#getHordeHp();
  //   }
  // }

  // #getHordeHp() {
  //   const horde = this.parent.token?.getFlag(game.system.id, "horde");
  //   if (this.parent.isToken && horde) {
  //     const size = this.parent.token.parent.tokens.filter(
  //       t => t.getFlag(game.system.id, "horde") === horde
  //     ).length;
  //     return size * 10;
  //   }
  //   return 1;
  // }
}

export class BossModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ACTOR"];
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true, label: "HELLPIERCERS.Biography" }),
      faction: new fields.StringField({}),
      tags: new fields.SetField(new fields.StringField(), { initial: ["Boss"] }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        max: new fields.NumberField({ required: true, initial: 10, integer: true }),
      }),
      scale: new fields.NumberField({ integer: true, initial: 1, nullable: false }),
      speed: new fields.NumberField({ required: true, initial: 4, integer: true }),
      actions: new fields.NumberField({ initial: 1, integer: true }),
      agnosia: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10 }),
        effect: new fields.HTMLField({}),
      }),
      attacks: new fields.ArrayField(
        new OwnedItemField({
          initial: null,
          nullable: true,
        }),
        { initial: [] }
      ),
      special: new OwnedItemField({ initial: null, nullable: true }),
    };
  }

  prepareBaseData() {
    // Idk why this doesn't properly initialize?
    this.attacks = this.attacks.map(a => a()).filter(a => !!a);
  }
}

export class FactionModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField(),
      drive: new fields.SchemaField({
        description: new fields.StringField(),
        level: new fields.NumberField({ initial: 5 }),
      }),
      qualities: new fields.SchemaField({
        force: new fields.NumberField(),
        subterfuge: new fields.NumberField(),
        territory: new fields.NumberField(),
        assets: new fields.NumberField(),
      }),
    };
  }
}
