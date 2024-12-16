/** @typedef {import("../../client/pixi/placeables/template").MeasuredTemplate} MeasuredTemplate */
/** @typedef {import("../documents/weapon.mjs").HellpiercersWeapon} */

import { Range } from "../../data/range-model.mjs";

/**
 * Extends the default measured template to allow for gridspace based templates
 * using a range datamodel from {@link hellpiercers.data.RangeModel}
 */
export class HellpiercersMeasuredTemplate extends MeasuredTemplate {
  _getGridHighlightPositions() {
    if (!this.document.getFlag(game.system.id, "range")) return super._getGridHighlightPositions();
    const range = new Range(this.document.getFlag(game.system.id, "range"));
    const direction = Math.round(this.document.direction / 90) - 1;
    const grid = canvas.grid;
    const origin = grid.getOffset(this.document);
    return range.shape.map(s => {
      s = rotateRange(s, direction);
      return grid.getTopLeftPoint({ i: s.i + origin.i, j: s.j + origin.j });
    });
  }

  get bounds() {
    if (!this.document.getFlag(game.system.id, "range")) return super.bounds;
    const range = new Range(this.document.getFlag(game.system.id, "range"));
    /** @type {{i: number; j: number}} */
    const offset = canvas.grid.getOffset(this.document);
    const direction = Math.round(this.document.direction / 90) - 1;
    const shape = range.shape.map(s => {
      s = rotateRange(s, direction);
      return canvas.grid.getCenterPoint({ i: s.i + offset.i, j: s.j + offset.j });
    });
    const topleft = {
      x: Math.min(...shape.map(p => p.x)) - 1,
      y: Math.min(...shape.map(p => p.y)) - 1,
    };
    const size = {
      w: Math.max(...shape.map(p => p.x - topleft.x), 1),
      h: Math.max(...shape.map(p => p.y - topleft.y), 1),
    };
    return new PIXI.Rectangle(topleft.x, topleft.y, size.w, size.h);
  }
}

/**
 * Rotate the offset 90° n times
 * @param {Object} o
 * @param {number} o.i
 * @param {number} o.j
 * @param {number} n
 */
function rotateRange({ i, j }, n) {
  n = (n + 4) % 4;
  if (n == 0) return { i, j };
  return rotateRange({ i: j, j: -i }, n - 1);
}
