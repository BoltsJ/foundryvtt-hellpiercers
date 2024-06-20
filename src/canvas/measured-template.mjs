/** @typedef {import("../../client/pixi/placeables/template").MeasuredTemplate} MeasuredTemplate */
/** @typedef {import("../documents/weapon.mjs").HellpiercersWeapon} */

import { RangeModel } from "../data/range-model.mjs";

/**
 * Extends the default measured template to allow for gridspace based templates
 * using a range datamodel from {@link hellpiercers.data.RangeModel}
 */
export class HellpiercersMeasuredTemplate extends MeasuredTemplate {
  _getGridHighlightPositions() {
    if (!this.document.getFlag(game.system.id, "range")) return super._getGridHighlightPositions();
    /** @type {RangeModel} */
    const range = new RangeModel(this.document.getFlag(game.system.id, "range"));

    const grid = canvas.grid;
    const origin = grid.getOffset(this.document);
    return range.spaces.map(s => grid.getTopLeftPoint({ i: s.i + origin.i, j: s.j + origin.j }));
  }
}
