import { Damage } from "./damage.mjs";

export class DamageMessageModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      damage: new fields.EmbeddedDataField(Damage, { nullable: false }),
      target: new fields.DocumentUUIDField(),
    };
  }
}
