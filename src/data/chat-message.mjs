import { Damage } from "./damage.mjs";

export class DamageMessageModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      damage: new fields.EmbeddedDataField(Damage, { nullable: false }),
      target: new fields.DocumentUUIDField(),
      handled: new fields.BooleanField({ initial: false }),
    };
  }

  addListeners(html) {
    const target = fromUuidSync(this.target);
    const button_row = html.querySelector("div.button-row");
    if ((!target?.isOwner && target?.documentName !== "Actor") || !button_row || this.handled) {
      return;
    }
    const apply = document.createElement("button");
    apply.dataset.target = this.target;
    apply.type = "button";
    apply.addEventListener("click", () =>
      this.damage.apply(target, { message_id: this.parent.id })
    );
    apply.addEventListener("mouseenter", ev =>
      target.getActiveTokens().pop()?._onHoverIn(ev, { hoverOutOthers: true })
    );
    apply.addEventListener("mouseleave", ev => target.getActiveTokens().pop()?._onHoverOut(ev));
    apply.innerHTML = "<i class='fa-solid fa-sword'></i>Apply";
    button_row?.append(apply);
  }
}

export class ResponseMessageModel extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      message: new fields.DocumentIdField({ nullable: true, initial: null }),
    };
  }

  _onCreate() {
    const message = game.messages.get(this.message);
    if (!message || !message.isOwner) return;
    message.update({ "system.handled": true });
  }
}
