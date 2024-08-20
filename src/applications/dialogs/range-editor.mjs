const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

export class RangeEditor extends HandlebarsApplicationMixin(ApplicationV2) {
  static PARTS = {
    head: { template: "systems/hellpiercers/templates/dialogs/range-editor/head.hbs" },
    // grid: { template: "systems/hellpiercers/templates/dialogs/range-editor/grid.hbs" },
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
  };

  /** @type {import("../../data/range-model.mjs").RangeModel} */
  #range;
  /** @type {string[][]} */
  #grid = [["@"]];
  /** @type {((value: any) => void) | null} */
  #resolve = null;
  /** @type {((value: any) => void) | null} */
  // #reject = null;

  constructor(range, options = {}) {
    super(options);
    if (!(range instanceof hellpiercers.data.RangeModel))
      range = new hellpiercers.data.RangeModel(range);
    this.#range = range.clone();
  }

  async _prepareContext() {
    return {
      range: this.#range,
      fields: this.#range.schema.fields,
      grid: this.#grid,
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
    return ctx;
  }

  /** @this {RangeEditor} */
  static async #formHandler(ev, form, formData) {
    const data = formData.object;
    if (data.kind === "bespoke") data.spaces = []; // TODO: Add the grid stuff
    this.#range.updateSource(data);
    this.render();
    if (ev.type === "submit") {
      this.#resolve?.(this.#range);
      this.close();
    }
  }

  static editRange(range) {
    const app = new this(range);
    return new Promise(resolve => {
      app.#resolve = resolve;
      // app.#reject = reject;
      app.render(true);
    });
  }
}
