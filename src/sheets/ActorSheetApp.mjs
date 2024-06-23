import { SvelteApplication } from "#runtime/svelte/application";
import ActorSheetAppShell from "./ActorSheetAppShell.svelte";

export default class HellpiercersActorSheet extends SvelteApplication {
  /** @inheritdoc */
  constructor(actor, options = {}) {
    super(
      foundry.utils.mergeObject(
        { id: `HellpiercersActorSheet_${actor.uuid.replaceAll(".", "_")}` },
        options
      )
    );
    this.actor = actor;
    this.object = actor;
    this.document = actor;
  }

  /** @returns {ApplicationOptions} */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "actor"],
      resizable: true,
      width: 600,
      height: 600,
      ["minWidth"]: 600,
      ["minHeight"]: 400,
      sheetConfig: true,
      svelte: {
        class: ActorSheetAppShell,
        target: document.body,
        intro: true,
      },
      token: null,
      viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
    });
  }

  /** @override */
  render(force = false, options = {}) {
    if (!DocumentSheet.prototype._canUserView.call(this, game.user)) {
      if (!force) return this; // If rendering is not being forced, fail silently
      const err = game.i18n.format("SHEETS.DocumentSheetPrivate", {
        type: game.i18n.localize(this.object.constructor.metadata.label),
      });
      ui.notifications.warn(err);
      return this;
    }
    this.object.apps[this.appId] = this;
    return super.render(force, options);
  }

  async close(...args) {
    this.options.token = null;
    super.close(...args);
  }

  get isEditable() {
    return Object.getOwnPropertyDescriptor(DocumentSheet.prototype, "isEditable").get.call(this);
  }

  get token() {
    return Object.getOwnPropertyDescriptor(ActorSheet.prototype, "token").get.call(this);
  }

  _getHeaderButtons() {
    const label = game.i18n.localize(this.object.constructor.metadata.label);
    return [
      {
        class: "document-id-link",
        icon: "fa-solid fa-passport",
        styles: { opacity: 0.5 },
        title: "SHEETS.CopyUuid",
        alignLeft: true,
        onPress: () => {
          game.clipboard.copyPlainText(this.object.uuid);
          ui.notifications.info(
            game.i18n.format("DOCUMENT.IdCopiedClipboard", {
              label,
              type: "uuid",
              id: this.object.uuid,
            })
          );
        },
        onContextMenu: () => {
          game.clipboard.copyPlainText(this.object.id);
          ui.notifications.info(
            game.i18n.format("DOCUMENT.IdCopiedClipboard", {
              label,
              type: "id",
              id: this.object.id,
            })
          );
        },
      },
      ...ActorSheet.prototype._getHeaderButtons.call(this),
    ];
  }

  _onConfigureToken(...args) {
    return ActorSheet.prototype._onConfigureToken.call(this, ...args);
  }

  _onConfigureSheet(...args) {
    return ActorSheet.prototype._onConfigureSheet.call(this, ...args);
  }

  // async _renderOuter(...args) {
  //   const html = await super._renderOuter(...args);
  //   DocumentSheet.prototype._createDocumentIdLink.call(this, html);
  //   return html;
  // }
}
