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
      onEditImage: this.prototype._onEditImage,
    },
    form: { submitOnChange: true },
  };

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

  async _onEditImage(_e, target) {
    if (!this.isEditable) return;
    const prop = target.dataset.edit;
    const current = foundry.utils.getProperty(this.actor, prop);
    const fp = new FilePicker({
      current,
      type: "image",
      callback: v => {
        target.src = v;
        this.actor.update({ [prop]: v });
      },
    });
    return fp.browse();
  }

  async _onCreateEmbed(_e, target) {
    if (!this.isEditable) return;
    const embedType = target.dataset.embedType;
    const embedData = this._getDefaultEmbedData(embedType);
    const cls = getDocumentClass(embedType);
    if (!cls) throw new Error(`Invalid document type: '${embedType}'`);
    cls.createDialog(embedData, { parent: this.actor });
  }

  /**
   * @param {Event} ev
   * @param {HTMLElement} target
   */
  async _onDeleteEmbed(ev, target) {
    if (!this.isEditable) return;
    const noConfirm = ev.shiftKey;
    const uuid = target.parentElement.dataset.UUID;
    const doc = await fromUuid(uuid);
    if (!doc) throw new Error(`Document not found. uuid: ${uuid}`);
    if (doc.parent !== this.actor)
      throw new Error(`Document not a child of actor ${this.actor.uuid}`);
    if (noConfirm) doc.delete();
    else doc.deleteDialog();
  }

  _getDefaultEmbedData(embedType) {
    const img = embedType === "Item" ? "icons/svg/bag.svg" : "icons/svg/aura.svg";
    return { img };
  }
}
