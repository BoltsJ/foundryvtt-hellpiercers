export class HellpiercersChatMessage extends ChatMessage {
  /** @param {HTMLElement} html */
  addListeners(html) {
    switch (this.type) {
      case "damage":
        return this.#addDamageListeners(html);
      default:
        return;
    }
  }

  /** @param {HTMLElement} html */
  #addDamageListeners(html) {
    const target = fromUuidSync(this.system.target);
    const button_row = html.querySelector("div.button-row");
    if ((!target?.isOwner && target?.documentName !== "Actor") || !button_row) return;
    const apply = document.createElement("button");
    apply.dataset.target = this.system.target;
    apply.type = "button";
    apply.addEventListener("click", () => this.system.damage.apply(target));
    apply.addEventListener("mouseenter", ev =>
      target.getActiveTokens().pop()?._onHoverIn(ev, { hoverOutOthers: true })
    );
    apply.addEventListener("mouseleave", ev => target.getActiveTokens().pop()?._onHoverOut(ev));
    apply.innerHTML = "<i class='fa-solid fa-sword'></i>Apply";
    button_row?.append(apply);
  }
}
