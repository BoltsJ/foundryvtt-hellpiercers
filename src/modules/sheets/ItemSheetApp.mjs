import { SvelteApplication } from "#runtime/svelte/application";
import ItemSheetAppShell from "./ItemSheetAppShell.svelte";

export default class HellpiercersItemSheet extends SvelteApplication {
  /** @inheritdoc */
  constructor(item, options = {}) {
    super(
      foundry.utils.mergeObject(
        { id: `HellpiercersItemSheet_${item.uuid.replaceAll(".", "_")}` },
        options
      )
    );
    this.item = item;
    this.object = item;
    this.document = item;
  }

  /** @returns {ApplicationOptions} */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "actor"],
      resizable: true,
      width: 400,
      height: 400,
      ["minWidth"]: 400,
      ["minHeight"]: 400,
      sheetConfig: true,
      svelte: {
        class: ItemSheetAppShell,
        target: document.body,
        intro: true,
      },
      token: null,
    });
  }

  async close(...args) {
    this.options.token = null;
    super.close(...args);
  }

  get isEditable() {
    return Object.getOwnPropertyDescriptor(DocumentSheet.prototype, "isEditable").get.call(this);
  }

  _getHeaderButtons() {
    return ItemSheet.prototype._getHeaderButtons.call(this);
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
