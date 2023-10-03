import { BaseItemHellpiercers } from "./baseitem.mjs";

export class HellpiercersWeapon extends BaseItemHellpiercers {
  /** @returns {this is HellpiercersWeapon} */
  isWeapon() {
    return true;
  }

  /** @returns {("@"|"."|"O")[][]} */
  get rangeGrid() {
    /** @type {{row: number, col: number}[]} */
    const range = this.system.range;

    const size = range.reduce(
      (acc, space) => {
        if (acc[2] > space.row) acc[2] = space.row;
        if (acc[3] < space.row) acc[3] = space.row;
        if (acc[4] > space.col) acc[4] = space.col;
        if (acc[5] < space.col) acc[5] = space.col;
        acc[0] = acc[3] - acc[2] + 1;
        acc[1] = acc[5] - acc[4] + 1;
        return acc;
      },
      [0, 0, 0, 0, 0, 0]
    );

    const m = Array(size[1])
      .fill(Array(size[0]).fill("."))
      .map(a => [...a]);

    for (let r = 0; r < size[0]; r++) {
      for (let c = 0; c < size[1]; c++) {
        if (c === -size[4] && r === -size[2]) m[c][r] = "@";
        if (range.some(space => space.row === r + size[2] && space.col === c + size[4]))
          m[c][r] = "O";
      }
    }
    return m;
  }

  // get rangeSvg() {
  //   const grid = this.rangeGrid;
  //   const rows = grid[0].length;
  //   const cols = grid.length;

  //   /** @param {number} i
  //    * @param {number} j
  //    */
  //   function generateSquare(i, j) {
  //     const group = draw.group().addClass("draw-block");
  //     group.rect(100, 100).fill("white").stroke("black").move(i * 100, j * 100);
  //   }

  //   const draw = SVG().size("100%", "100%").viewbox(`0 0 ${rows * 100} ${cols * 100}`)

  //   for (let i = 0; i < rows; i++) {
  //     for (let j = 0; j < rows; j++) {
  //       generateSquare(i, j);
  //     }
  //   }

  //   console.log(draw);
  //   return draw;
  // }
}
