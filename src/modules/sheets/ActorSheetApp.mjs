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
    });
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
    return ActorSheet.prototype._getHeaderButtons.call(this);
  }

  _onConfigureToken(...args) {
    return ActorSheet.prototype._onConfigureToken.call(this, ...args);
  }

  _onConfigureSheet(...args) {
    return ActorSheet.prototype._onConfigureSheet.call(this, ...args);
  }

  async _renderOuter(...args) {
    const html = await super._renderOuter(...args);
    DocumentSheet.prototype._createDocumentIdLink.call(this, html);
    return html;
  }
}
