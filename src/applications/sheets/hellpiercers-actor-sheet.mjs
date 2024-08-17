const api = foundry.applications.api;
const sheets = foundry.applications.sheets;

export class HellpiercersActorSheet extends api.HandlebarsApplicationMixin(sheets.ActorSheetV2) {
  #dragDrop;

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
    dragDrop: [{ dragSelector: "[data-drag]", dropSelector: null }],
  };

  constructor(...args) {
    super(...args);
    this.#dragDrop = this.#createDragDropHandlers();
  }

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

  // eslint-disable-next-line no-unused-vars
  _onRender(_ctx, _opts) {
    this.#dragDrop.forEach(d => d.bind(this.element));
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
    const uuid = target.closest("[data-uuid]").dataset.uuid;
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
    const uuid = target.closest("[data-uuid]").dataset.uuid;
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
    const uuid = target.closest("[data-uuid]").dataset.uuid;
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

  // Here be dragEnds

  /**
   * Handle a dropped Item
   * @param {string} uuid  The uuid for the dropped item
   */
  // eslint-disable-next-line no-unused-vars
  async _onItemDrop(uuid) {}

  /**
   * Define whether a user is able to begin a dragstart workflow for a given drag selector
   * @param {string} selector       The candidate HTML selector for dragging
   * @returns {boolean}             Can the current user drag this selector?
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _canDragStart(selector) {
    // game.user fetches the current user
    return this.isEditable;
  }

  /**
   * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
   * @param {string} selector       The candidate HTML selector for the drop target
   * @returns {boolean}             Can the current user drop on this selector?
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _canDragDrop(selector) {
    // game.user fetches the current user
    return this.isEditable;
  }

  /**
   * Callback actions which occur at the beginning of a drag start workflow.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _onDragStart(event) {
    const el = event.currentTarget;
    if ("link" in event.target.dataset) return;

    let dragData = null;
    switch (el.dataset.drag) {
      case "attack":
        dragData = { type: "attackmacro", uuid: el.closest("[data-uuid]").dataset.uuid };
        break;
      default:
        break;
    }

    if (!dragData) return;

    // Set data transfer
    event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
  }

  /**
   * Callback actions which occur when a dragged element is over a drop target.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  // eslint-disable-next-line no-unused-vars
  _onDragOver(event) {}

  /**
   * Callback actions which occur when a dragged element is dropped on a target.
   * @param {DragEvent} event       The originating DragEvent
   * @protected
   */
  async _onDrop(event) {
    const data = TextEditor.getDragEventData(event);

    // Handle different data types
    switch (data.type) {
      case "Item":
        this._onItemDrop(data.uuid);
        break;
      default:
        break;
    }
  }
  get dragDrop() {
    return this.#dragDrop;
  }

  /**
   * Create drag-and-drop workflow handlers for this Application
   * @returns {DragDrop[]}     An array of DragDrop handlers
   * @private
   */
  #createDragDropHandlers() {
    return this.options.dragDrop.map(d => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      };
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      };
      return new DragDrop(d);
    });
  }
}
