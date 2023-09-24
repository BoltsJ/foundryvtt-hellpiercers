import { SvelteApplication } from "#runtime/svelte/application";
import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
import ActorSheetAppShell from "./ActorSheetAppShell.svelte";

export default class HellpiercersActorSheet extends SvelteApplication {
  /** @inheritdoc */
  constructor(actor, options = {}) {
    super(
      foundry.utils.mergeObject(
        {
          id: `doc_${actor.uuid.replaceAll(".", "_")}`,
          svelte: {
            props: {
              actor: new TJSDocument(actor),
            },
          },
        },
        options
      )
    );
    // this.isEditable = true;
    this.actor = actor;
    this.object = actor;
    this.document = actor;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "actor"],
      width: 600,
      height: 600,
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
