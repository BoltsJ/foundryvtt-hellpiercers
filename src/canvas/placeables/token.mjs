export class HellpiercersToken extends Token {
  /** @override */
  async _drawEffects() {
    this.effects.renderable = false;

    // Clear Effects Container
    this.effects.removeChildren().forEach(c => c.destroy());
    this.effects.bg = this.effects.addChild(new PIXI.Graphics());
    this.effects.overlay = null;

    // Categorize effects
    const activeEffects = this.actor?.temporaryEffects || [];
    let hasOverlay = false;

    // Draw effects
    const promises = [];
    for (const effect of activeEffects) {
      if (!effect.img) continue;
      if (effect.getFlag("core", "overlay") && !hasOverlay) {
        promises.push(this._drawOverlay(effect.img, effect.tint));
        hasOverlay = true;
      } else
        promises.push(
          this._drawEffect(effect.img, effect.tint, effect.getFlag(game.system.id, "value"))
        );
    }
    await Promise.allSettled(promises);

    this.effects.renderable = true;
    this.renderFlags.set({ refreshEffects: true });
  }

  /** @override */
  async _drawEffect(src, tint, val) {
    const icon = await super._drawEffect(src, tint);
    if (val) {
      const num = new PreciseText(val, this._getEffectTextStyle());
      num.x = icon.x - icon.width * 0.1;
      num.y = icon.y + icon.height * 0.5;
      num.scale.x = 17;
      num.scale.y = 17;
      icon.addChild(num);
    }
    return icon;
  }

  _getEffectTextStyle() {
    const style = CONFIG.canvasTextStyle.clone();
    style.fontSize = 18;
    if (canvas.dimensions.size >= 200) style.fontSize = 21;
    else if (canvas.dimensions.size < 50) style.fontSize = 15;
    style.wordWrapWidth = this.w * 2.5;
    return style;
  }
}

export class HellpiercersTokenHUD extends TokenHUD {
  /** @param {JQuery<HTMLElement>} html */
  activateListeners(html) {
    super.activateListeners(html);
    const effectsTray = html.find(".status-effects");
    effectsTray.off("click", ".effect-control");
    effectsTray.off("contextmenu", ".effect-control");
    const controls = effectsTray.find(".effect-control");
    controls.on("click", this.#incrementStatus.bind(this));
    controls.on("contextmenu", this.#decrementStatus.bind(this));
  }

  #incrementStatus(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!this.actor) return ui.notifications.warn("HUD.WarningEffectNoActor", { localize: true });

    const statusId = ev.currentTarget.dataset.statusId;
    this.actor.toggleStatusEffect(statusId, { direction: 1 });
  }

  #decrementStatus(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    if (!this.actor) return ui.notifications.warn("HUD.WarningEffectNoActor", { localize: true });

    const statusId = ev.currentTarget.dataset.statusId;
    this.actor.toggleStatusEffect(statusId, { direction: -1 });
  }
}
