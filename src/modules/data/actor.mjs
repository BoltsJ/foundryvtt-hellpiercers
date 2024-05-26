const fields = foundry.data.fields;
/**
 * @property {string} biography
 */
export class HumanModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS"];
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
      scale: new fields.NumberField({ initial: 1, integer: true, label: "HELLPIERCERS.Scale" }),
      speed: new fields.NumberField({ integer: true, label: "HELLPIERCERS.Speed" }),
      actions: new fields.NumberField({
        initial: 1,
        integer: true,
        label: "HELLPIERCERS.Activations",
      }),
      pronouns: new fields.StringField({ required: true, label: "HELLPIERCERS.Pronouns" }),
      callsign: new fields.StringField({ required: true, label: "HELLPIERCERS.Callsign" }),
      // Equipment
      class: new fields.DocumentIdField({ initial: null, nullable: true }),
      armor: new fields.DocumentIdField({ initial: null, nullable: true }),
      weapon: new fields.DocumentIdField({ initial: null, nullable: true }),
    };
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
