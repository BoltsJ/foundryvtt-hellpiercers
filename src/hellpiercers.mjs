import "./hellpiercers.scss";

import * as placeables from "./canvas/placeables/index.mjs";
import { placeTemplate } from "./canvas/range-template.mjs";
import { HellpiercersTemplateLayer } from "./canvas/template-layer.mjs";
import * as data from "./data/index.mjs";
import * as documents from "./documents/index.mjs";
import * as applications from "./applications/index.mjs";
import { getStatusEffects } from "./statuses.mjs";
import { RangeEditor } from "./applications/dialogs/range-editor.mjs";

globalThis.hellpiercers = {
  applications,
  RangeEditor,
  data,
  documents,
  placeTemplate,
};

const ascii_logo = ` 
░█░█░█▀▀░█░░░█░░░█▀█░▀█▀░█▀▀░█▀▄░█▀▀░█▀▀░█▀▄░█▀▀
░█▀█░█▀▀░█░░░█░░░█▀▀░░█░░█▀▀░█▀▄░█░░░█▀▀░█▀▄░▀▀█
░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀
`;
Hooks.once("init", () => {
  console.log("hellpiercers | Initializing HELLPIERCERS System", ascii_logo);

  const sheets = applications.sheets;

  CONFIG.ActiveEffect.legacyTransferral = false;
  CONFIG.statusEffects = getStatusEffects();

  // if (!game.modules.get("quench")?.active)
  //   game.data.packs = game.data.packs.filter(i => i.name != "debugmacros");

  // Actors
  CONFIG.Actor.dataModels.human = data.HumanModel;
  CONFIG.Actor.dataModels.demon = data.DemonModel;
  CONFIG.Actor.dataModels.boss = data.BossModel;
  CONFIG.Actor.dataModels.faction = data.FactionModel;
  CONFIG.Actor.documentClass = documents.HellpiercersActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hellpiercers", sheets.BossSheet, {
    types: ["boss"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Actor.boss",
  });
  Actors.registerSheet("hellpiercers", sheets.DemonSheet, {
    types: ["demon"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Actor.demon",
  });
  Actors.registerSheet("hellpiercers", sheets.HumanSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Actor.human",
  });

  // Items
  CONFIG.Item.dataModels.ability = data.AbilityModel;
  CONFIG.Item.dataModels.armor = data.ArmorModel;
  CONFIG.Item.dataModels.class = data.ClassModel;
  CONFIG.Item.dataModels.gear = data.GearModel;
  CONFIG.Item.dataModels.weapon = data.WeaponModel;
  CONFIG.Item.documentClass = documents.HellpiercersItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hellpiercers", sheets.AbilitySheet, {
    types: ["ability"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Item.ability",
  });
  Items.registerSheet("hellpiercers", sheets.ArmorSheet, {
    types: ["armor"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Item.armor",
  });
  Items.registerSheet("hellpiercers", sheets.ClassSheet, {
    types: ["class"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Item.class",
  });
  Items.registerSheet("hellpiercers", sheets.GearSheet, {
    types: ["gear"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Item.gear",
  });
  Items.registerSheet("hellpiercers", sheets.WeaponSheet, {
    types: ["weapon"],
    makeDefault: true,
    label: "HELLPIERCERS.SHEETS.Item.weapon",
  });

  // Templates
  CONFIG.Canvas.layers.templates.layerClass = HellpiercersTemplateLayer;
  CONFIG.MeasuredTemplate.objectClass = placeables.HellpiercersMeasuredTemplate;

  // Tokens
  CONFIG.Token.objectClass = placeables.HellpiercersToken;
  CONFIG.Token.hudClass = placeables.HellpiercersTokenHUD;
});
