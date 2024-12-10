import { HellpiercersMeasuredTemplate } from "./placeables/measured-template.mjs";

/** @import { Range } from "../data/range-model.mjs" */

class RangeTemplate extends HellpiercersMeasuredTemplate {
  /** @returns {Promise<MeasuredTemplateDocument>} */
  placeTemplate() {
    if (this.document.id)
      throw new Error("Template placement can't be done for already placed templates");
    const originalLayer = canvas.activeLayer;
    this.layer.activate();
    this.draw();
    this.layer.preview.addChild(this);
    return new Promise((resolve, reject) => {
      const handlers = {};
      handlers.move = ev => {
        ev.stopPropagation();
        const now = Date.now(); // Apply a 20ms throttle
        if (now - this.moveTime <= 20) return;

        const point = ev.data.getLocalPosition(this.layer);
        const snapped = canvas.activeLayer.getSnappedPoint(point);
        this.document.updateSource({ x: snapped.x, y: snapped.y });
        this.refresh();
        this.moveTime = now;
      };
      handlers.confirm = ev => {
        deactivateListeners(ev);
        canvas.scene
          .createEmbeddedDocuments("MeasuredTemplate", [this.document.toObject()])
          .then(r => resolve(r.shift()));
      };
      handlers.cancel = ev => {
        deactivateListeners(ev);
        reject();
      };
      handlers.wheel = ev => {
        ev.stopPropagation();
        this.document.updateSource({
          direction: this.document.direction + 90 * Math.sign(ev.deltaY),
        });
        this.refresh();
      };

      const deactivateListeners = ev => {
        this.layer._onDragLeftCancel(ev ?? {});
        canvas.stage.off("mousemove", handlers.move);
        canvas.stage.off("mousedown", handlers.confirm);
        canvas.app.view.oncontextmenu = null;
        canvas.app.view.onwheel = null;
        originalLayer.activate();
      };

      canvas.stage.on("mousemove", handlers.move);
      canvas.stage.on("mousedown", handlers.confirm);
      canvas.app.view.oncontextmenu = handlers.cancel;
      canvas.app.view.onwheel = handlers.wheel;
    });
  }
}

/** @param {Range | object} range */
export async function placeTemplate(range, { actor = null, flags = {} } = {}) {
  range.modifiers ??= {};
  range.modifiers.scale ??= actor?.system.scale;
  /** @type {typeof MeasuredTemplateDocument} */
  const cls = getDocumentClass("MeasuredTemplate");
  const doc = new cls(
    {
      t: "cone",
      angle: 1,
      distance: 0.5,
      flags: foundry.utils.mergeObject(flags, { hellpiercers: { range } }),
    },
    { parent: canvas.scene }
  );
  const template = new RangeTemplate(doc);
  return await template.placeTemplate();
}
