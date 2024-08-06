import { RangeModel } from "./range-model.mjs";

const fields = foundry.data.fields;

export class AbilityModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ITEM"];
  static defineSchema() {
    return {
      action: new fields.StringField({
        initial: "active",
        blank: false,
        choices: {
          active: "HELLPIERCERS.ITEM.action.active",
          attack: "HELLPIERCERS.ITEM.action.attack",
          limit: "HELLPIERCERS.ITEM.action.limit",
          movement: "HELLPIERCERS.ITEM.action.movement",
          passive: "HELLPIERCERS.ITEM.action.passive",
          reversal: "HELLPIERCERS.ITEM.action.reversal",
          special: "HELLPIERCERS.ITEM.action.special",
        },
      }),
      damage: new fields.StringField({
        required: true,
        nullable: true,
        initial: null,
        validate: v => v === null || foundry.dice.Roll.validate(v),
        validationError: "must be a valid Roll formula",
      }),
      range: new fields.EmbeddedDataField(RangeModel, { nullable: true, initial: null }),
      uses: new fields.NumberField({ initial: null, nullable: true }),
      trigger: new fields.StringField({ initial: null, nullable: true }),
      break_value: new fields.NumberField({ initial: 10 }),
      effect: new fields.HTMLField({ required: true }),
      item: new fields.SchemaField({
        uuid: new fields.DocumentUUIDField({ nullable: true, initial: null }),
        type: new fields.StringField({
          blank: true,
          initial: "",
          choices: {
            armor: "TYPES.Item.armor",
            class: "TYPES.Item.class",
            weapon: "TYPES.Item.weapon",
          },
        }),
      }),
    };
  }
}

/**
 * Data model for PC weapons
 */
export class WeaponModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ITEM"];
  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true }),
      damage: new fields.StringField({
        required: true,
        initial: "0 + 1D6",
        validate: v => foundry.dice.Roll.validate(v),
        validationError: "must be a valid Roll formula",
      }),
      range: new fields.ArrayField(new fields.EmbeddedDataField(RangeModel), { initial: [{}] }),
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

export class ArmorModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ITEM"];
  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true }),
      speed: new fields.NumberField({ required: true }),
      movement: new fields.DocumentUUIDField({ initial: null }),
      ability: new fields.DocumentUUIDField({ initial: null }),
      reversal: new fields.DocumentUUIDField({ initial: null }),
    };
  }

  static migrateData(data) {
    if (data.ability?.name) data.ability = null;
    if (data.reversal?.enabled) data.reversal = null;
  }
}

export class ClassModel extends foundry.abstract.TypeDataModel {
  static LOCALIZATION_PREFIXES = ["HELLPIERCERS.ITEM"];
  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true }),
      health: new fields.NumberField({ integer: true, initial: 15 }),
      active: new fields.DocumentUUIDField({ nullable: true, initial: null }),
      passive: new fields.DocumentUUIDField({ nullable: true, initial: null }),
      limit: new fields.DocumentUUIDField({ nullable: true, initial: null }),
    };
  }
}

export class GearModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      kind: new fields.StringField({
        required: true,
        initial: "weapon",
        choices: {
          armor: "TYPES.Item.armor",
          weapon: "TYPES.Item.weapon",
        },
      }),
      target: new fields.StringField({
        required: true,
        initial: "",
      }),
      effect: new fields.HTMLField({ required: true }),
      description: new fields.HTMLField({ required: true }),
    };
  }
}

export class EquipmentModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      description: new fields.HTMLField({ required: true }),
    };
  }
}
