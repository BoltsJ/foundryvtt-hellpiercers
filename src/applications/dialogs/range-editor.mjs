const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/** @import { RangeModel } from "../../data/range-model.mjs" */

export class RangeEditor extends HandlebarsApplicationMixin(ApplicationV2) {
  static PARTS = {
    head: { template: "systems/hellpiercers/templates/dialogs/range-editor/head.hbs" },
    grid: { template: "systems/hellpiercers/templates/dialogs/range-editor/grid.hbs" },
    modifiers: { template: "systems/hellpiercers/templates/dialogs/range-editor/modifiers.hbs" },
    footer: { template: "templates/generic/form-footer.hbs" },
  };
  static DEFAULT_OPTIONS = {
    tag: "form",
    window: { title: "HELLPIERCERS.DIALOG.RangeEditor.title" },
    form: {
      handler: this.#formHandler,
      submitOnChange: true,
      closeOnSubmit: false,
    },
    classes: ["hellpiercers", "range-editor"],
    actions: {
      addCol: this.#addCol,
      addRow: this.#addRow,
      delCol: this.#delCol,
      delRow: this.#delRow,
      toggleSpace: this.#toggleSpace,
    },
  };

  /** @type {RangeModel} */
  #range;
  /** @type {string[][]} */
  #grid = [["@"]];
  /** @type {((value: any) => void) | null} */
  #resolve = null;
  /** @type {((value: any) => void) | null} */
  #reject = null;

  /**
   * Static helper to get a promise that resoves to a new range with the changes applied
   * @returns {Promise<RangeModel>}
   */
  static editRange(range) {
    const app = new this(range);
    return new Promise((resolve, reject) => {
      app.#resolve = resolve;
      app.#reject = reject;
      app.render(true);
    });
  }

  constructor(range, options = {}) {
    super(options);
    if (!(range instanceof hellpiercers.data.RangeModel))
      range = new hellpiercers.data.RangeModel(range);
    this.#range = range.clone();
    this.#grid = range.ascii;
  }

  async _prepareContext() {
    return {
      range: this.#range,
      fields: this.#range.schema.fields,
      buttons: [{ type: "submit", name: "submit", icon: "fa-solid fa-save", label: "Save" }],
    };
  }

  async _preparePartContext(partId, ctx) {
    if (partId === "modifiers") {
      ctx.show = {
        range: ["blast", "line", "cone", "ring", "star", "wall", "targets", "blob"].includes(
          ctx.range.kind
        ),
        length: ["wall"].includes(ctx.range.kind),
        width: ["line"].includes(ctx.range.kind),
        push: true,
        recoil: !["burst", "ring", "star", "charge"].includes(ctx.range.kind),
      };
    }
    if (partId === "grid") {
      ctx.grid = { rows: this.#grid.length, columns: this.#grid[0].length };
      ctx.spaces = this.#grid.flatMap((r, i) => r.map((s, j) => ({ symbol: s, row: i, col: j })));
    }
    return ctx;
  }

  /** @this {RangeEditor} */
  static async #formHandler(ev, _form, formData) {
    console.log(ev);
    const data = formData.object;
    if (data.kind === "bespoke") data.spaces = g2a(this.#grid);
    this.#range.updateSource(data);
    if (this.#range.kind !== "bespoke") this.#grid = this.#range.ascii;
    this.render();
    if (ev.type === "submit") {
      this.#resolve?.(this.#range);
      this.#reject = null;
      this.close();
    }
  }

  async _preClose() {
    this.#reject?.(new Error("Range Editor closed without saving"));
  }

  /** @this {RangeEditor} */
  static #addRow(_ev, target) {
    if (target.dataset.loc === "bot") this.#grid.push(Array(this.#grid[0].length).fill("."));
    else this.#grid.unshift(Array(this.#grid[0].length).fill("."));
    this.render(false);
  }

  /** @this {RangeEditor} */
  static #delRow(_ev, target) {
    const idx = target.dataset.loc === "bot" ? -1 : 0;
    if (this.#grid.at(idx).some(s => s === "@" || s === "0")) return;
    this.#grid.splice(idx, 1);
    this.render(false);
  }

  /** @this {RangeEditor} */
  static #addCol(_ev, target) {
    if (target.dataset.loc === "right") this.#grid.forEach(r => r.push("."));
    else this.#grid.forEach(r => r.unshift("."));
    this.render(false);
  }

  /** @this {RangeEditor} */
  static #delCol(_ev, target) {
    const idx = target.dataset.loc === "right" ? -1 : 0;
    if (this.#grid.map(r => r.at(idx)).some(s => s === "@" || s === "0")) return;
    this.#grid.forEach(r => r.splice(idx, 1));
    this.render(false);
  }

  /** @this {RangeEditor} */
  static #toggleSpace(_ev, target) {
    /** @type {{row: number; col: number; sym: "."|"O"|"@"|"0" }} */
    const { row, col, sym } = target.dataset;
    const c = { ".": "O", O: ".", "@": "0", ["0"]: "@" };
    this.#grid[row][col] = c[sym];
    this.render(false);
  }
}

/** @param {string[][]} grid */
function g2a(grid) {
  const spaces = [];
  const offset = {
    i: -grid.findIndex(r => r.some(v => ["@", "0"].includes(v))),
    j: -grid.find(r => r.some(v => ["@", "0"].includes(v))).findIndex(v => ["@", "0"].includes(v)),
  };
  grid.forEach((r, i) =>
    r.forEach((s, j) => {
      if (s === "O" || s === "0") spaces.push({ i: i + offset.i, j: j + offset.j });
    })
  );
  return spaces;
}
