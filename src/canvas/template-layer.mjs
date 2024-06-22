export class HellpiercersTemplateLayer extends TemplateLayer {
  getSnappedPoint(point) {
    return canvas.grid.getSnappedPoint(point, {
      mode: CONST.GRID_SNAPPING_MODES.CENTER,
      resolution: 1,
    });
  }

  /**
   * @param {PIXI.FederatedEvent} event      The PIXI InteractionEvent which wraps a PointerEvent
   */
  _onDragLeftMove(event) {
    super._onDragLeftMove(event);
    if (!canvas.grid.isSquare) return;
    const { preview } = event.interactionData;
    preview.document.direction = Math.round(preview.document.direction / 90) * 90;
  }

  /**
   * @param {PIXI.FederatedEvent} event      The PIXI InteractionEvent which wraps a PointerEvent
   */
  _onMouseWheel(event) {
    if (!canvas.grid.isSquare) return super._onMouseWheel(event);
    const template = this.hover;
    if (!template || template.isPreview) return;

    const delta = 90 * Math.sign(event.delta);
    return template.rotate(template.document.direction + delta, 90);
  }
}
