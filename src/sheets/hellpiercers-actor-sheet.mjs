const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export class HellpiercersActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  static PARTS = {
    header: { template: "templates/sheets/actor-sheet.html" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    biography: { template: "systems/hellpiercers/templates/sheets/actor-biography.hbs" },
  };

  static DEFAULT_OPTIONS = {
    classes: ["hellpiercers", "actor"],
    actions: {
      onCreateEmbed: this.prototype._onCreateEmbed,
      onDeleteEmbed: this.prototype._onDeleteEmbed,
      onEditImage: this.prototype._onEditImage,
      onEmbedSheet: this.prototype._onEmbedSheet,
      onUpdateEmbed: this.prototype._onUpdateEmbed,
    },
    form: { submitOnChange: true },
    position: { height: 700, width: 600 },
  };

  async _prepareContext() {
    const ctx = {
      editable: this.isEditable,
      owner: this.actor.isOwner,
      actor: this.actor,
      system: this.actor.system,
      fields: this.actor.system.schema.fields,
      tabs: this._getTabs(),
    };
    return ctx;
  }

  _getTabs() {
    /** @type {Record<string, TabsConfiguration>} */
    const tabs = {};
    Object.keys(this.constructor.PARTS).forEach(id => {
      if (["header", "tabs"].includes(id)) return;
      this.tabGroups["primary"] ??= id;
      const active = this.tabGroups["primary"] === id;
      tabs[id] = {
        id,
        group: "primary",
        label: `HELLPIERCERS.ACTOR.TABS.${id}`,
        active,
        cssClass: active ? "active" : undefined,
      };
    });
    return tabs;
  }

  async _getEffects() {
    const ctx = {
      temporary: [],
      items: [],
      effects: [],
    };
    for (let effect of this.document.allApplicableEffects()) {
      if (effect.parent !== this.document) ctx.items.push(effect);
      else if (effect.isTemporary) ctx.temporary.push(effect);
      else ctx.effects.push(effect);
    }
    return ctx;
  }

  async _onEditImage(_ev, target) {
    if (!this.isEditable) return;
    const prop = target.dataset.edit;
    const current = foundry.utils.getProperty(this.document, prop);
    const fp = new FilePicker({
      current,
      type: "image",
      callback: v => {
        target.src = v;
        this.document.update({ [prop]: v });
      },
    });
    return fp.browse();
  }

  async _onCreateEmbed(_ev, target) {
    if (!this.isEditable) return;
    const embedType = target.dataset.embedType;
    const typeData = target.dataset.subType ?? "base";
    const category = target.dataset.category;
    const embedData = this._getDefaultEmbedData(embedType, typeData, category);
    const cls = getDocumentClass(embedType);
    if (!cls) throw new Error(`Invalid document type: '${embedType}'`);
    cls.createDialog(embedData, { parent: this.document });
  }

  /**
   * @param {Event} ev
   * @param {HTMLElement} target
   */
  async _onDeleteEmbed(ev, target) {
    if (!this.isEditable) return;
    const noConfirm = ev.shiftKey;
    const uuid = target.closest("[data--u-u-i-d]").dataset.UUID;
    const doc = await fromUuid(uuid);
    if (!doc) throw new Error(`Document not found. uuid: ${uuid}`);
    if (doc.parent !== this.document)
      throw new Error(`Document not a child of document ${this.document.uuid}`);
    if (noConfirm) doc.delete();
    else doc.deleteDialog();
  }

  /**
   * @param {Event} _ev
   * @param {HTMLElement} target
   */
  async _onUpdateEmbed(_ev, target) {
    if (!this.isEditable) return;
    const uuid = target.closest("[data--u-u-i-d]").dataset.UUID;
    const path = target.dataset.property;
    const val = target.type == "checkbox" ? target.checked : target.value;
    const doc = await fromUuid(uuid);
    if (!doc) throw new Error(`Document not found. uuid: ${uuid}`);
    doc.update({ [path]: val });
  }

  /**
   * @param {Event} _ev
   * @param {HTMLElement} target
   */
  async _onEmbedSheet(_ev, target) {
    if (!this.isEditable) return;
    const uuid = target.closest("[data--u-u-i-d]").dataset.UUID;
    const doc = await fromUuid(uuid);
    if (!doc) throw new Error(`Document not found. uuid: ${uuid}`);
    doc.sheet.render(true);
  }

  // eslint-disable-next-line no-unused-vars
  _getDefaultEmbedData(embedType, typeData, _category) {
    const { img } =
      embedType === "Item"
        ? getDocumentClass("Item").getDefaultArtwork({ type: typeData })
        : { img: "icons/svg/aura.svg" };
    return { img };
  }
}
