export class HellpiecerModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      biography: new fields.HTMLField({ required: true }),
      pronouns: new fields.StringField({ required: true }),
      callsign: new fields.StringField({ required: true }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        max: new fields.NumberField({ required: true, initial: 10, integer: true }),
      }),
      movement: new fields.NumberField({
        required: true,
        initial: 4,
        integer: true,
      }),
    };
  }
}

export class DemonModel extends foundry.abstract.DataModel {}

export class FactionModel extends foundry.abstract.DataModel {}
