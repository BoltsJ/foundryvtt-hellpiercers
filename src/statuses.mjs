/**
 * Counters
 * slow - Slow - "turn"
 * haste - Haste - "trigger"
 * poison - Poison - ??? ("turn")
 * bleed - Bleed - "turn"
 * pin - Pin - "turn"
 * blazing - Blazing - "special"
 * shock - Shock - "turn"
 * aegis - Aegis - "turn"
 * healing - Healing - "turn"
 * transference - Transference - "turn"
 * countdown - Countdown - "round"
 * bound - Bound - "turn"
 * shaded - Shaded - "turn"
 * compel - Compel - "trigger"
 * enrage - Enrage - "turn"
 * armor - Armor - "turn"
 *
 * Fixed
 * Dead - Overlay
 * Fortified - Tile
 * Piercing - Attack tag
 * Breaker - Attack tag
 * Seeking - Attack tag
 */

/**
 * Decay triggers
 * End of turn - "turn"
 * End of Round - "round"
 * When triggered - "trigger"
 */

/**
 * Tranform the status effects below into valid data for CONFIG.statusEffects
 * @returns {{id: string; name: string; img: string; flags: object}}
 */
export function getStatusEffects() {
  return statusEffects.map(e => {
    e.name ??= `HELLPIERCERS.STATUSES.${e.id}`;
    return foundry.utils.expandObject(e);
  });
}

const statusEffects = [
  {
    id: "slow",
    img: "icons/svg/anchor.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "haste",
    img: "icons/svg/wingfoot.svg",
    "flags.hellpiercers.decay": "trigger",
  },
  {
    id: "poison",
    img: "icons/svg/poison.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "bleed",
    img: "icons/svg/blood.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "pin",
    img: "icons/svg/falling.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "blazing",
    img: "icons/svg/fire.svg",
    "flags.hellpiercers.decay": "special",
  },
  {
    id: "shock",
    img: "icons/svg/stoned.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "aegis",
    img: "icons/svg/angel.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "healing",
    img: "icons/svg/heal.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "transference",
    img: "icons/svg/regen.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "countdown",
    img: "icons/svg/clockwork.svg",
    "flags.hellpiercers.decay": "round",
  },
  {
    id: "bound",
    img: "icons/svg/net.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "shaded",
    img: "icons/svg/mystery-man.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "compel",
    img: "icons/svg/unconscious.svg",
    "flags.hellpiercers.decay": "trigger",
  },
  {
    id: "enrage",
    img: "icons/svg/terror.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "armor",
    img: "icons/svg/shield.svg",
    "flags.hellpiercers.decay": "turn",
  },
  {
    id: "dead",
    name: "EFFECT.StatusDead",
    img: "icons/svg/skull.svg",
    "flags.core.overlay": true,
    "flags.hellpiercers.decay": "never",
  },
];
