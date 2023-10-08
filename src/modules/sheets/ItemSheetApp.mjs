import { SvelteApplication } from "#runtime/svelte/application";
import ItemSheetAppShell from "./ItemSheetAppShell.svelte";

export default class HellpiercersItemSheet extends SvelteApplication {
  /**
   * @param {Item} item
   * @param {Object} options
   * @inheritdoc
   */
  constructor(item, options = {}) {
    super(
      foundry.utils.mergeObject(
        { id: `HellpiercersItemSheet_${item.uuid.replaceAll(".", "_")}` },
        options
      )
    );
    /** @type {Item} */
    this.item = item;
    /** @type {Item} */
    this.object = item;
    /** @type {Item} */
    this.document = item;
  }

  /** @returns {ApplicationOptions} */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "item"],
      resizable: true,
      width: 400,
      height: 500,
      ["minWidth"]: 400,
      ["minHeight"]: 400,
      sheetConfig: true,
      svelte: {
        class: ItemSheetAppShell,
        target: document.body,
        intro: true,
      },
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

  _getHeaderButtons() {
    const label = game.i18n.localize(this.object.constructor.metadata.label);
    return [
      {
        class: "document-id-link",
        icon: "fa-solid fa-passport",
        styles: { opacity: 0.5 },
        title: label + ": " + this.object.id,
        alignLeft: true,
        onPress: () => {
          game.clipboard.copyPlainText(this.object.id);
          ui.notifications.info(
            game.i18n.format("DOCUMENT.IdCopiedClipboard", {
              label,
              type: "id",
              id: this.object.id,
            })
          );
        },
        onContextMenu: () => {
          game.clipboard.copyPlainText(this.object.uuid);
          ui.notifications.info(
            game.i18n.format("DOCUMENT.IdCopiedClipboard", {
              label,
              type: "uuid",
              id: this.object.uuid,
            })
          );
        },
      },
      ...ItemSheet.prototype._getHeaderButtons.call(this),
    ];
  }

  _onConfigureSheet(...args) {
    return ItemSheet.prototype._onConfigureSheet.call(this, ...args);
  }

  async _renderOuter(...args) {
    const html = await super._renderOuter(...args);
    DocumentSheet.prototype._createDocumentIdLink.call(this, html);
    return html;
  }
}
