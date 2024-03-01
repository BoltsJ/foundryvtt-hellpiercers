import { SvelteApplication } from "#runtime/svelte/application";
import RangeEditorAppShell from "./RangeEditorAppShell.svelte";

export class RangeEditorApp extends SvelteApplication {
  /**
   * @param {import("../../documents/weapon.mjs").HellpiercersWeapon} weapon
   * @param {{}} [options]
   */
  constructor(weapon, options = {}) {
    super(
      foundry.utils.mergeObject(
        { id: `HellpiercersRangeEditor_${weapon.uuid.replaceAll(".", "_")}` },
        options
      )
    );
    /** @type {import("../../documents/weapon.mjs").HellpiercersWeapon} */
    this.weapon = this.object = this.document = weapon;
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
