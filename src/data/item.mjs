/**
 * Data model for PC weapons
 */
export class WeaponModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    fields.DocumentIdField;
    return {
      description: new fields.HTMLField({ required: true }),
      damage: new fields.StringField({
        required: true,
        initial: "0 + 1d6",
        validate: v => Roll.validate(v),
      }),
      range: new fields.ArrayField(
        new fields.SchemaField({
          row: new fields.NumberField({ required: true, integer: true }),
          col: new fields.NumberField({ required: true, integer: true }),
        }),
        { initial: [{ row: 1, col: 0 }] }
      ),
      ability: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        kind: new fields.StringField({
          required: true,
          initial: "trigger",
          choices: ["trigger", "action"],
        }),
        description: new fields.HTMLField({ required: true }),
      }),
      active: new fields.BooleanField({ required: true, initial: false }),
    };
  }

  /**
   *    * Return a 2d array that represents the targeting of the weapon. Oriented as
   *       * if the wielder is facing South.
   *          * @returns {("@"|"."|"O")[][]}
   *             */
  get rangeGrid() {
    /** @type {{row: number, col: number}[]} */
    const range = this.range;

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
      [1, 1, 0, 0, 0, 0]
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

export class ArmorModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
      speed: new fields.NumberField({ required: true }),
      movement: new fields.HTMLField({ required: true }),
      resistances: new fields.SetField(new fields.StringField()),
      ability: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
    };
  }
}

export class ClassModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
      health: new fields.NumberField({ integer: true, initial: 15 }),
      active: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
      passive: new fields.SchemaField({
        name: new fields.StringField({ required: true }),
        description: new fields.HTMLField({ required: true }),
      }),
    };
  }
}

export class GearModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      kind: new fields.StringField({
        required: true,
        initial: "weapon",
        choices: ["weapon", "armor"],
      }),
      target: new fields.StringField({
        required: true,
        initial: "",
      }),
      effect: new fields.HTMLField({ required: true }),
      description: new fields.HTMLField({ required: true }),
    };
  }
}

export class EquipmentModel extends foundry.abstract.DataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      description: new fields.HTMLField({ required: true }),
    };
  }
}

export class RoleModel extends foundry.abstract.DataModel {}
