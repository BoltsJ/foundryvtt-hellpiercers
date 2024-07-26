import { SvelteApplication } from "#runtime/svelte/application";
import RangeEditorAppShell from "./RangeEditorAppShell.svelte";

export class RangeEditorApp extends SvelteApplication {
  /**
   * @param {import("../../data/range-model.mjs").RangeModel} range
   * @param {{}} [options]
   */
  constructor(range, options = {}) {
    super(foundry.utils.mergeObject({ id: `HellpiercersRangeEditor` }, options));
    /** @type {typeof range} */
    this.range = range.clone();
  }

  /** @param {import("../../data/range-model.mjs").RangeModel} range */
  static editRange(range) {
    const app = new this(range);
    /** @type {Promise<typeof range} */
    let r = new Promise((resolve, reject) => {
      app.resolve = resolve;
      app.reject = reject;
      app.render(true);
    });
    return r;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "item"],
      resizable: true,
      width: 400,
      height: 400,
      ["minWidth"]: 400,
      ["minHeight"]: 400,
      // sheetConfig: true,
      svelte: {
        class: RangeEditorAppShell,
        target: document.body,
        intro: true,
      },
      viewPermission: CONST.DOCUMENT_OWNERSHIP_LEVELS.LIMITED,
    });
  }
}
