const fields = foundry.data.fields;

export class RangeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      label: new fields.StringField({ initial: "Range" }),
      kind: new fields.StringField({
        initial: "bespoke",
        choices: [
          "bespoke",
          "burst",
          "blast",
          "line",
          "cone",
          "ring",
          "star",
          "charge",
          "wall",
          "arc",
          "targets",
          "blob",
        ],
      }),
      spaces: new fields.ArrayField(
        new fields.SchemaField({
          i: new fields.NumberField({ required: true, integer: true }),
          j: new fields.NumberField({ required: true, integer: true }),
        }),
        { initial: [{ i: 1, j: 0 }], required: false }
      ),
      modifiers: new fields.SchemaField(
        {
          range: new fields.NumberField({ initial: null, nullable: true }),
          width: new fields.NumberField({ initial: null, nullable: true }),
          length: new fields.NumberField({ initial: null, nullable: true }),
          push: new fields.NumberField({ initial: null, nullable: true }),
          recoil: new fields.NumberField({ initial: null, nullable: true }),
        },
        { initial: {}, required: false }
      ),
    };
  }

  /**
   * Return a 2d array that represents the targeting of the weapon. Oriented as
   * if the wielder is facing South.
   * @returns {("@"|"."|"O")[][]}
   */
  get rangeGrid() {
    const size = this.spaces.reduce(
      (acc, space) => {
        if (acc[2] > space.i) acc[2] = space.i;
        if (acc[3] < space.i) acc[3] = space.i;
        if (acc[4] > space.j) acc[4] = space.j;
        if (acc[5] < space.j) acc[5] = space.j;
        acc[0] = acc[3] - acc[2] + 1;
        acc[1] = acc[5] - acc[4] + 1;
        return acc;
      },
      [1, 1, 0, 0, 0, 0]
    );

    const m = Array(size[0])
      .fill(Array(size[1]).fill("."))
      .map(a => [...a]);

    for (let r = 0; r < size[0]; r++) {
      for (let c = 0; c < size[1]; c++) {
        if (c === -size[4] && r === -size[2]) m[r][c] = "@";
        if (this.spaces.some(space => space.i === r + size[2] && space.j === c + size[4]))
          m[r][c] = "O";
      }
    }
    return m;
  }

  get rangeSvg() {
    const square_size = 20;
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    let matrix = this.rangeGrid;
    // Rotate -90° so it points right instead of down
    matrix = matrix[0].map((_, i) => matrix.map(r => r[r.length - 1 - i]));
    const rows = matrix.length;
    const cols = matrix[0]?.length;

    for (let col = 0; col < cols; col++) {
      for (let row = 0; row < rows; row++) {
        let square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        square.setAttribute("width", square_size);
        square.setAttribute("height", square_size);

        square.setAttribute("x", 5 + col * square_size);
        square.setAttribute("y", 5 + row * square_size);

        let css;
        let img;
        switch (matrix[row][col]) {
          case ".":
            css = "";
            break;
          case "@":
            css = "origin";
            img = "icons/svg/mystery-man.svg";
            break;
          case "O":
            css = "target";
            img = "icons/svg/target.svg";
            break;
        }

        square.setAttribute("class", css);
        grid.appendChild(square);
        if (img) {
          let image = document.createElementNS("http://www.w3.org/2000/svg", "image");
          image.setAttribute("height", square_size);
          image.setAttribute("width", square_size);
          image.setAttribute("x", 5 + col * square_size);
          image.setAttribute("y", 5 + row * square_size);
          image.setAttribute("href", img);
          image.setAttribute("title", img);
          grid.appendChild(image);
        }
      }
    }

    grid.setAttribute("width", 10 + square_size * cols);
    grid.setAttribute("height", 10 + square_size * rows);

    return grid;
  }
}
