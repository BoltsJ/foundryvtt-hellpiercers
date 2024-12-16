import { placeTemplate } from "../../canvas/range-template.mjs";
import { setTargets } from "../../canvas/targeting.mjs";
import { Damage } from "../../data/damage.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class AttackDialog extends HandlebarsApplicationMixin(ApplicationV2) {
  constructor({ actor, item }, options = {}) {
    super(options);
    this.sourceItem = item?.id ? item : fromUuidSync(item);
    this.sourceActor = actor?.id ? actor : (fromUuidSync(actor) ?? item?.actor);
    if (this.sourceItem?.type === "weapon") {
      this.#formula = this.sourceItem.system.damage;
      this.#range = this.sourceItem.system.range;
    } else if (this.sourceItem?.type === "ability") {
      this.#formula = this.sourceItem.system.damage;
      this.#range = [this.sourceItem.system.range];
    } else if (this.sourceActor.type === "demon") {
      this.#formula = this.sourceActor.system.strike.damage;
      this.#range = [this.sourceActor.system.strike.range];
    }
    if (!this.sourceActor) throw new Error("Attacks must come from an actor");
  }

  /** @type {number | null} */
  #hookId = null;
  #formula = null;
  #range = null;
  #resolve = null;

  static PARTS = {
    header: { template: "systems/hellpiercers/templates/dialogs/attack/header.hbs" },
    main: { template: "systems/hellpiercers/templates/dialogs/attack/main.hbs" },
    footer: { template: "templates/generic/form-footer.hbs", classes: ["flexrow"] },
  };

  static DEFAULT_OPTIONS = {
    window: { title: "HELLPIERCERS.DIALOG.AttackDialog.title" },
    classes: ["hellpiercers", "attack-dialog"],
    actions: {
      cancel: this.prototype.close,
      confirm: this.#confirm,
      placeTemplate: this.#placeTemplate,
    },
  };

  static attack({ actor, item }) {
    const dialog = new this({ actor, item });
    return new Promise(resolve => {
      dialog.#resolve = resolve;
      dialog.render(true);
    });
  }

  async _prepareContext() {
    return {
      attacker: this.sourceActor,
      item: this.sourceItem,
      formula: this.#formula,
      range: this.#range.map(range => ({
        range,
        aoe: !["arc", "blob", "targets"].includes(range.kind),
      })),
      targets: game.user.targets,
      buttons: [
        { type: "button", label: "Confirm", icon: "fa-solid fa-check", action: "confirm" },
        { type: "button", label: "Cancel", icon: "fa-solid fa-cancel", action: "cancel" },
      ],
    };
  }

  /** @this {AttackDialog} */
  static async #confirm() {
    for (const target of game.user.targets.ids) {
      const token = canvas.tokens.get(target);
      const actor = token.actor;
      const roll = await new foundry.dice.Roll(
        this.#formula,
        this.sourceActor.getRollData()
      ).evaluate();
      const damage = new Damage({
        value: roll.total,
        source: this.sourceItem?.uuid ?? this.sourceActor.uuid,
        conditions: {},
        qualities: {},
        roll: JSON.stringify(roll.toJSON()),
      });
      await damage.toMessage(roll, actor.uuid);
    }
    if (game.user.targets.size === 0) {
      const roll = await new foundry.dice.Roll(
        this.#formula,
        this.sourceActor.getRollData()
      ).evaluate();
      const damage = new Damage({
        value: roll.total,
        source: this.sourceItem?.uuid ?? this.sourceActor.uuid,
        conditions: {},
        qualities: {},
        roll: JSON.stringify(roll.toJSON()),
      });
      await damage.toMessage(roll);
    }
    this.close();
  }

  /** @this {AttackDialog} */
  static async #placeTemplate(_ev, target) {
    await this.minimize();
    const { index } = target.dataset;
    const range = this.#range[index];
    range.updateSource({ "modifiers.scale": this.sourceActor.system.scale });
    await placeTemplate(range, { actor: this.sourceActor, flags: { "hellpiercers.attack": true } })
      .then(setTargets)
      .catch(() => {});
    await this.maximize();
  }

  #onUpdateTargets(user) {
    if (user.id !== game.userId) return;
    this.render(false);
  }

  _onRender() {
    /** @type {HTMLElement} */
    const element = this.element;
    const target_divs = element.querySelectorAll("div.target");
    target_divs.forEach(div =>
      div.addEventListener("mouseenter", ev => {
        const { tokenId } = ev.target.dataset;
        const token = canvas.tokens.get(tokenId);
        token?._onHoverIn(ev, { hoverOutOthers: true });
      })
    );
    target_divs.forEach(div =>
      div.addEventListener("mouseleave", ev => {
        const { tokenId } = ev.target.dataset;
        const token = canvas.tokens.get(tokenId);
        token?._onHoverOut(ev);
      })
    );
  }

  async _preFirstRender(ctx, opts) {
    await super._preFirstRender(ctx, opts);
    this.#hookId = Hooks.on("targetToken", this.#onUpdateTargets.bind(this));
  }

  async _preClose(opts) {
    await super._preClose(opts);
    this.#resolve?.();
    Hooks.off("targetToken", this.#hookId);
  }
}
