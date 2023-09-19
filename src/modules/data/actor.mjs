/** @param {string} string
 * @returns {string}
 */
function localize(string) {
  return game.i18n?.localize(string) ?? string;
}

class CreatureModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      biography: new fields.HTMLField({ required: true }),
      faction: new fields.StringField(),
      tags: new fields.SetField(new fields.StringField({ initial: "Tag" }), { initial: ["Tag"] }),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 10, integer: true }),
        max: new fields.NumberField({ required: true, initial: 10, integer: true }),
      }),
      scale: new fields.NumberField(),
      speed: new fields.NumberField({
        required: true,
        initial: 4,
        integer: true,
      }),
      actions: new fields.StringField({ initial: "1" }),
    };
  }
}

export class HumanModel extends CreatureModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      pronouns: new fields.StringField({ required: true }),
      callsign: new fields.StringField({ required: true }),
    };
  }
}

export class DemonModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {};
  }
}

export class BossModel extends DemonModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      ...super.defineSchema(),
      health: new fields.SchemaField({
        value: new fields.NumberField({ required: true, initial: 50, integer: true }),
        max: new fields.NumberField({ required: true, initial: 50, integer: true }),
        agnosia: new fields.NumberField({ required: true, initial: 10 }),
      }),
    };
  }
}

export class FactionModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
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
