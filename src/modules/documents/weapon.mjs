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

    const m = Array(size[0])
      .fill(Array(size[1]).fill("."))
      .map(a => [...a]);

    for (let r = 0; r < size[0]; r++) {
      for (let c = 0; c < size[1]; c++) {
        if (c === -size[4] && r === -size[2]) m[r][c] = "@";
        if (range.some(space => space.row === r + size[2] && space.col === c + size[4]))
          m[r][c] = "O";
      }
    }
    return m;
  }

  get rangeSvg() {
    const square_size = 15;
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    let matrix = this.rangeGrid;
    // Rotate -90° so it points right instead of down
    matrix = matrix[0].map((_, i) => matrix.map(r => r[r.length-1-i]));
    const rows = matrix.length;
    const cols = matrix[0]?.length;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        let square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        square.setAttribute("width", square_size);
        square.setAttribute("height", square_size);

        square.setAttribute("x", 5 + col * square_size);
        square.setAttribute("y", 5 + row * square_size);

        let color;
        switch (matrix[row][col]) {
          case ".":
            color = "none";
            break;
          case "@":
            color = "blue";
            break;
          case "O":
            color = "yellow";
            break;
        }

        square.setAttribute(
          "style",
          `fill: ${color}; stroke: black; stroke-width: 2; fill-opacity: 0.8; stroke-opacity: 1`
        );

        grid.appendChild(square);
      }
    }

    grid.setAttribute("width", 10 + square_size * cols);
    grid.setAttribute("height", 10 + square_size * rows);

    return grid;
  }
}
