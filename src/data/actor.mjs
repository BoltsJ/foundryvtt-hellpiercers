import { RangeModel } from "./range-model.mjs";

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
      max_weapons: new fields.NumberField({ required: true, initial: 1, integer: true }),
    };
  }

  prepareBaseData() {
    this.health.max = this.class?.system.health ?? 10;
    this.speed = this.armor?.system?.speed ?? 3;
  }
}

export class DemonModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ACTOR"];
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true, label: "HELLPIERCERS.Biography" }),
      faction: new fields.StringField({ label: "HELLPIERCERS.Faction" }),
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
        range: new fields.EmbeddedDataField(RangeModel, {
          initial: { kind: "targets", value: 1, modifiers: { range: 0 } },
        }),
        damage: new fields.StringField({
          required: true,
          initial: "3",
          validate: v => foundry.dice.Roll.validate(v),
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
      faction: new fields.StringField({ label: "HELLPIERCERS.Faction" }),
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
    this.attacks = this.attacks.map(a => a()).filter(a => !!a);
    // Idk why this doesn't properly initialize?
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
