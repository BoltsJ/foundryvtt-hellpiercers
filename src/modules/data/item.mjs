/**
 * Data model for PC weapons
 */
export class WeaponModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    fields.DocumentIdField;
    return {
      damage: new fields.StringField({
        required: true,
        initial: "1d6",
        validate: v => Roll.validate(v),
      }),
      range: new fields.ArrayField(
        new fields.SchemaField({
          row: new fields.NumberField({ required: true, integer: true }),
          col: new fields.NumberField({ required: true, integer: true }),
        }),
        { initial: [{ row: 1, col: 0 }] }
      ),
      special: new fields.SchemaField({
        name: new fields.StringField({ required: true, initial: "Special Ability" }),
        kind: new fields.StringField({
          required: true,
          initial: "trigger",
          choices: ["trigger", "action"],
        }),
        description: new fields.HTMLField({ required: true, initial: "Description..." }),
      }),
      equipped: new fields.BooleanField({ required: true, initial: false }),
    };
  }
}

export class ArmorModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {};
  }
}

export class ClassModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {};
  }
}

export class GearModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {};
  }
}

export class RoleModel extends foundry.abstract.DataModel {}
