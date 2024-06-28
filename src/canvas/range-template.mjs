import { RangeModel } from "../data/range-model.mjs";
import { HellpiercersMeasuredTemplate } from "./measured-template.mjs";

class RangeTemplate extends HellpiercersMeasuredTemplate {
  placeTemplate() {
    this.originalLayer = canvas.activeLayer;
    this.layer.activate();
    this.draw();
    this.layer.preview.addChild(this);
    return this.activateListeners();
  }

  /** @returns {Promise<MeasuredTemplateDocument>} */
  activateListeners() {
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
        this.originalLayer.activate();
      };

      canvas.stage.on("mousemove", handlers.move);
      canvas.stage.on("mousedown", handlers.confirm);
      canvas.app.view.oncontextmenu = handlers.cancel;
      canvas.app.view.onwheel = handlers.wheel;
    });
  }
}

/** @param {RangeModel | object} range */
export async function placeTemplate(range, actor = null) {
  range = new RangeModel(range);
  range.modifiers.scale ??= actor?.system.scale;
  /** @type {typeof MeasuredTemplateDocument} */
  const cls = getDocumentClass("MeasuredTemplate");
  const doc = new cls(
    {
      t: "cone",
      angle: 1,
      distance: 1,
      flags: { hellpiercers: { range } },
    },
    { parent: canvas.scene }
  );
  const template = new RangeTemplate(doc);
  return await template.placeTemplate();
}
