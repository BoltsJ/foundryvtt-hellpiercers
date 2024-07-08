export class HellpiercersActor extends Actor {
  /** @override */
  async toggleStatusEffect(statusId, { direction }) {
    const status = CONFIG.statusEffects.find(e => e.id === statusId);
    if (!status)
      throw new Error(`Invalid status ID "${statusId}" provided to Actor#toggleStatusEffect`);

    const existing = [];

    // Find the effect with the static _id of the status effect
    if (status._id) {
      const effect = this.effects.get(status._id);
      if (effect) existing.push(effect.toObject());
    } else {
      // If no static _id, find all single-status effects that have this status
      existing.push(
        ...this.effects
          .filter(e => e.statuses.size === 1 && e.statuses.has(status.id))
          .map(e => e.toObject())
      );
    }

    if (existing.length > 0) {
      existing.forEach(e =>
        foundry.utils.setProperty(
          e,
          `flags.${game.system.id}.value`,
          (e.flags[game.system.id]?.value ?? 1) + direction
        )
      );

      const deletions = existing
        .filter(e => (e.flags[game.system.id]?.value ?? 1) <= 0)
        .map(e => e._id);
      const updates = existing.filter(e => (e.flags[game.system.id]?.value ?? 1) > 0);

      return Promise.allSettled([
        this.deleteEmbeddedDocuments("ActiveEffect", deletions),
        this.updateEmbeddedDocuments("ActiveEffect", updates),
      ]).then(r => r.flatMap(p => (p.status === "fulfilled" ? p.value : null)));
    } else if (direction > 0) {
      // Create the effect with a count of direction
      const cls = getDocumentClass("ActiveEffect");
      const effect = await cls.fromStatusEffect(statusId);
      effect.updateSource({ [`flags.${game.system.id}.value`]: direction });
      return cls.create(effect, { parent: this, keepId: true });
    }
  }
}
