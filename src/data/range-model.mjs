const fields = foundry.data.fields;

import TARGET_ICON from "../../public/assets/icons/targeting.svg?raw";
import USER_ICON from "../../public/assets/icons/spiked-halo.svg?raw";

export class RangeModel extends foundry.abstract.DataModel {
  static defineSchema() {
    return {
      label: new fields.StringField({ initial: "Range" }),
      kind: new fields.StringField({
        label: "HELLPIERCERS.RANGE.FIELDS.kind.label",
        initial: "bespoke",
        choices: {
          bespoke: "HELLPIERCERS.RANGE.type.bespoke",
          burst: "HELLPIERCERS.RANGE.type.burst",
          blast: "HELLPIERCERS.RANGE.type.blast",
          line: "HELLPIERCERS.RANGE.type.line",
          cone: "HELLPIERCERS.RANGE.type.cone",
          ring: "HELLPIERCERS.RANGE.type.ring",
          star: "HELLPIERCERS.RANGE.type.star",
          charge: "HELLPIERCERS.RANGE.type.charge",
          wall: "HELLPIERCERS.RANGE.type.wall",
          arc: "HELLPIERCERS.RANGE.type.arc",
          targets: "HELLPIERCERS.RANGE.type.targets",
          blob: "HELLPIERCERS.RANGE.type.blob",
        },
      }),
      value: new fields.NumberField({
        label: "HELLPIERCERS.RANGE.FIELDS.value.label",
        initial: 1,
        nullable: false,
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
          range: new fields.NumberField({
            label: "HELLPIERCERS.RANGE.FIELDS.modifiers.range.label",
            initial: null,
            nullable: true,
          }),
          width: new fields.NumberField({
            label: "HELLPIERCERS.RANGE.FIELDS.modifiers.width.label",
            initial: null,
            nullable: true,
          }),
          length: new fields.NumberField({
            label: "HELLPIERCERS.RANGE.FIELDS.modifiers.length.label",
            initial: null,
            nullable: true,
          }),
          push: new fields.NumberField({
            label: "HELLPIERCERS.RANGE.FIELDS.modifiers.push.label",
            initial: null,
            nullable: true,
          }),
          recoil: new fields.NumberField({
            label: "HELLPIERCERS.RANGE.FIELDS.modifiers.recoil.label",
            initial: null,
            nullable: true,
          }),
          scale: new fields.NumberField({ initial: null, nullable: true }),
        },
        { initial: {}, required: false }
      ),
    };
  }

  /**
   * Get an array of the points that the attack will target. Computes the shape
   * for standard shapes. Empty for "targets" and "blob" ranges
   * @returns {{i: number; j: number}[]}
   */
  get shape() {
    switch (this.kind) {
      case "bespoke":
        return this.spaces;
      case "burst":
        return getRing(this.value, {
          ...this.modifiers,
          range: (this.modifiers.scale ?? this.#getParentActor()?.system.scale ?? 1) - 1,
        });
      case "blast":
        return getBlast(this.value, this.modifiers);
      case "line":
        return getLine(this.value, this.modifiers);
      case "cone":
        return getCone(this.value, this.modifiers);
      case "ring":
        return getRing(this.value, this.modifiers);
      case "star":
        return getStar(this.value);
      case "charge":
        return getLine(this.value);
      case "wall":
        return getLine(this.modifiers.length ?? 1, { ...this.modifiers, width: this.value });
      case "arc":
      case "targets":
      case "blob":
      default:
        return [];
    }
  }

  /**
   * Return a 2d array that represents the targeting of the weapon. Oriented as
   * if the wielder is facing South.
   * @returns {("@"|"."|"O")[][]}
   */
  get ascii() {
    const size = this.shape.reduce(
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
        if (this.shape.some(space => space.i === r + size[2] && space.j === c + size[4])) {
          m[r][c] = m[r][c] === "@" ? "0" : "O";
        }
      }
    }
    return m;
  }

  get svg() {
    const square_size = 20;
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const stylesheet = document.createElementNS("http://www.w3.org/2000/svg", "style");
    stylesheet.innerHTML = `
      rect { stroke: black; stroke-width: 2; fill: gray; fill-opacity: 0.75; }
      rect.target { fill: red; }
      rect.origin { fill: blue; }
    `;
    grid.appendChild(stylesheet);

    let matrix = this.ascii;
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
            img = USER_ICON;
            break;
          case "O":
          case "0":
            css = "target";
            img = TARGET_ICON;
            break;
        }

        square.setAttribute("class", css);
        grid.appendChild(square);
        if (img) {
          let image = new DOMParser().parseFromString(img, "image/svg+xml").activeElement;
          image.setAttribute("height", square_size);
          image.setAttribute("width", square_size);
          image.setAttribute("x", 5 + col * square_size);
          image.setAttribute("y", 5 + row * square_size);
          grid.appendChild(image);
        }
      }
    }

    grid.setAttribute("width", 10 + square_size * cols);
    grid.setAttribute("height", 10 + square_size * rows);

    return grid;
  }

  get svg_uri() {
    // You can't simply use outerHTML
    const data = new XMLSerializer().serializeToString(this.svg);
    return `data:image/svg+xml;base64,${window.btoa(data)}`;
  }

  get short_text() {
    let kind = game.i18n.localize(`HELLPIERCERS.RANGE.type.${this.kind}`);
    if (this.kind === "bespoke") return kind;
    let modifiers = [];
    if (this.modifiers.range != null)
      modifiers.push(
        `${game.i18n.localize("HELLPIERCERS.RANGE.FIELDS.modifiers.range.label")}:${this.modifiers.range}`
      );
    if (this.modifiers.length != null)
      modifiers.push(
        `${game.i18n.localize("HELLPIERCERS.RANGE.FIELDS.modifiers.length.label")}:${this.modifiers.length}`
      );
    if (this.modifiers.width != null)
      modifiers.push(
        `${game.i18n.localize("HELLPIERCERS.RANGE.FIELDS.modifiers.width.label")}:${this.modifiers.width}`
      );
    if (this.modifiers.push != null)
      modifiers.push(
        `${game.i18n.localize("HELLPIERCERS.RANGE.FIELDS.modifiers.push.label")}:${this.modifiers.push}`
      );
    if (this.modifiers.recoil != null)
      modifiers.push(
        `${game.i18n.localize("HELLPIERCERS.RANGE.FIELDS.modifiers.recoil.label")}:${this.modifiers.recoil}`
      );

    return [`${kind}:${this.value}`, ...modifiers].join(",");
  }

  /** @returns {Actor | null} */
  #getParentActor() {
    let parent = this.parent;
    while (parent && !(parent instanceof Actor)) parent = parent.parent;
    return parent ?? null;
  }
}

/**
 * @param {number} length
 * @param {Object} modifiers
 * @param {number} [modifiers.width]
 * @param {number} [modifiers.range]
 */
function getLine(length, { width = 1, range = 0 } = {}) {
  const r = [];
  const span = Array(width)
    .fill(null)
    .map((_, i) => ({ i: 0, j: i - Math.floor(width / 2) }));
  for (let i = 0; i < length; ++i) r.push(span.map(o => ({ i: i + 1 + range, j: o.j })));
  return r.flat();
}

/**
 * @param {number} thickness
 * @param {Object} modifiers
 * @param {number} [modifiers.range]
 */
function getRing(thickness, { range = 1 }) {
  const max_radius = thickness + range;
  const r = [];
  for (let i = -max_radius; i <= max_radius; ++i) {
    for (let j = -max_radius; j <= max_radius; ++j) {
      if (Math.abs(i) <= range && Math.abs(j) <= range) continue;
      r.push({ i, j });
    }
  }
  return r;
}

function getBlast(size, { range }) {
  const r =
    size == 1
      ? [
          { i: 0, j: 0 },
          { i: 1, j: 0 },
          { i: -1, j: 0 },
          { i: 0, j: 1 },
          { i: 0, j: -1 },
        ]
      : getRing(size, { range: -1 });
  if (range != null) r.forEach(s => (s.i += Math.max(2, size) + range));
  return r;
}

function getStar(size) {
  return Array(size)
    .fill(null)
    .map((_, i) => [
      { i: i + 1, j: i + 1 },
      { i: -i - 1, j: -i - 1 },
      { i: i + 1, j: -i - 1 },
      { i: -i - 1, j: i + 1 },
    ])
    .flat();
}

function getCone(size, { range = 0 }) {
  const r = [];
  for (let i = 0; i < size; ++i) {
    r.push(getLine(1, { width: 2 * i + 1, range: range + i }));
  }
  return r.flat();
}
