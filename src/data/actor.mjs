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
    return () => model.parent?.getEmbeddedDocument("Item", value) ?? null;
  }
}

export class HumanModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.HUMAN"];
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

export class DemonModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true, label: "HELLPIERCERS.Biography" }),
      faction: new fields.StringField({ label: "HELLPIERCERS.Faction" }),
      tags: new fields.SetField(new fields.StringField(), {
        initial: ["Tag"],
        label: "HELLPIERCERS.Tags",
      }),
      health: new fields.SchemaField(
        {
          value: new fields.NumberField({ required: true, initial: 10, integer: true }),
          max: new fields.NumberField({ integer: true }),
        },
        { label: "HELLPIERCERS.HP" }
      ),
      scale: new fields.NumberField({ label: "HELLPIERCERS.Scale" }),
      speed: new fields.NumberField({
        required: true,
        initial: 4,
        integer: true,
        label: "HELLPIERCERS.Speed",
      }),
      actions: new fields.NumberField({
        initial: 1,
        integer: true,
        label: "HELLPIERCERS.Activations",
      }),
    };
  }
}

export class BossModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      biography: new fields.HTMLField({ required: true, label: "HELLPIERCERS.Biography" }),
      faction: new fields.StringField({ label: "HELLPIERCERS.Faction" }),
      tags: new fields.SetField(new fields.StringField(), {
        initial: ["Tag"],
        label: "HELLPIERCERS.Tags",
      }),
      health: new fields.SchemaField(
        {
          value: new fields.NumberField({ required: true, initial: 50, integer: true }),
          max: new fields.NumberField({ required: true, initial: 50, integer: true }),
          agnosia: new fields.NumberField({ required: true, initial: 10 }),
        },
        { label: "HELLPIERCERS.HP" }
      ),
      scale: new fields.NumberField({ label: "HELLPIERCERS.Scale" }),
      speed: new fields.NumberField({
        required: true,
        initial: 4,
        integer: true,
        label: "HELLPIERCERS.Speed",
      }),
      actions: new fields.NumberField({
        initial: 1,
        integer: true,
        label: "HELLPIERCERS.Activations",
      }),
    };
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
