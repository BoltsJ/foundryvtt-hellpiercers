/**
 * Data model for PC weapons
 */
export class WeaponModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    fields.DocumentIdField;
    return {
      description: new fields.HTMLField({ required: true }),
      damage: new fields.StringField({
        required: true,
        initial: "0 + 1d6",
        validate: v => Roll.validate(v),
      }),
      range: new fields.ArrayField(
        new fields.SchemaField({
          row: new fields.NumberField({ required: true, integer: true }),
          col: new fields.NumberField({ required: true, integer: true }),
        }),
        { initial: [{ row: 1, col: 0 }] }
      ),
      ability: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        kind: new fields.StringField({
          required: true,
          initial: "trigger",
          choices: ["trigger", "action"],
        }),
        description: new fields.HTMLField({ required: true }),
      }),
      active: new fields.BooleanField({ required: true, initial: false }),
    };
  }
}

export class ArmorModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
      speed: new fields.NumberField({ required: true }),
      movement: new fields.HTMLField({ required: true }),
      resistances: new fields.SetField(new fields.StringField()),
      special: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
    };
  }
}

export class ClassModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
      health: new fields.NumberField({ integer: true, initial: 15 }),
      active: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
      passive: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
    };
  }
}

export class GearModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
    };
  }
}

export class RoleModel extends foundry.abstract.DataModel {}
