export function setTargets(template) {
  if (typeof template === "string") template = fromUuidSync(template);
  if (!template) throw new Error("No template given");
  const { sizeX, sizeY } = canvas.grid;
  const spaces = template.object
    ._getGridHighlightPositions()
    .map(({ x, y }) => canvas.grid.getOffset({ x: x + sizeX * 0.5, y: y + sizeY * 0.5 }));
  const targets = canvas.tokens.quadtree
    .getObjects(template.object.bounds, {
      collisionTest: o => {
        const token = o.t;
        const offsets = token.getOccupiedSpaces().map(p => canvas.grid.getOffset(p));
        return spaces.some(s => offsets.some(o => o.i === s.i && o.j === s.j));
      },
    })
    .map(t => t.id);
  game.user.updateTokenTargets(targets);
  game.user.broadcastActivity({ targets: game.user.targets.ids });
}
