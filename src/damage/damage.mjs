/** @import {HellpiercersActor} from "../documents/actor.mjs" */
const fields = foundry.data.fields;

export class Damage extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      value: new fields.NumberField({ integer: true, initial: 1 }),
      source: new fields.DocumentUUIDField({ nullable: true, initial: null }),
      conditions: new fields.ObjectField(),
      qualities: new fields.SchemaField({
        piercing: new fields.BooleanField({ initial: false }),
        transference: new fields.BooleanField({ initial: false }),
        breaker: new fields.BooleanField({ initial: false }),
        overpenetrating: new fields.BooleanField({ initial: false }),
      }),
      roll: new fields.JSONField(),
      wrack: new fields.NumberField({ integer: true, nullable: true, initial: null }),
    };
  }

  /** @param {HellpiercersActor} target */
  async apply(target) {
    if (!target.canUserModify(game.user, "update")) throw new Error("Cannot modify actor");
    const armor = target.statuses.has("armor");
    const bleed = target.statuses.has("bleed");
    const mod = (bleed ? 1 : 0) - (armor ? 1 : 0);

    await target.update({ "system.health.value": target.system.health.value - (this.value + mod) });
    for (const cond in this.conditions) {
      const data = {};
      const val = this.conditions[cond];
      if (typeof val === "number") {
        data.direction = val;
      } else {
        data.active = !!val;
      }
      await target.toggleStatusEffect(cond, data);
    }
    await this.#printConfirmation(this.value + mod);
  }

  async #printConfirmation(value) {
    const cm = getDocumentClass("ChatMessage");
    const damage_msg = `Applied <strong>${value}</strong> damage`;
    const statuses = [];
    for (const cond in this.conditions) {
      console.log(cond);
      statuses.push(`<strong>${cond}:${this.conditions[cond]}</strong>`);
    }
    console.log(this.conditions);
    const status_msg = statuses.length ? " and " + statuses.join(", ") : "";
    cm.create({
      content: damage_msg + status_msg + ".",
    });
  }

  /** @import Roll from "../../client-esm/dice/roll.mjs" */
  /** @param {Roll} roll */
  async toMessage(roll, target) {
    if (!roll && this.roll) roll = foundry.dice.Roll.fromJSON(this.roll);
    const rolldata = await roll.getTooltip();
    const conditions = [];
    for (const k in this.conditions) {
      const condition = foundry.utils.duplicate(CONFIG.statusEffects.find(e => e.id === k));
      condition.value = this.conditions[k] === true ? 1 : this.conditions[k];
      conditions.push(condition);
    }
    const content = await renderTemplate("systems/hellpiercers/templates/chat/damage.hbs", {
      title: `Damaging ${fromUuidSync(target)?.name ?? "UNKNOWN"}`,
      damage: this,
      conditions,
      roll,
      rolldata,
    });
    const cls = getDocumentClass("ChatMessage");
    cls.create({ type: "damage", content, rolls: [roll], system: { damage: this, target } });
  }
}
