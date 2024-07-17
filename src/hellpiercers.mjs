import "./hellpiercers.scss";

import * as placeables from "./canvas/placeables/index.mjs";
import { placeTemplate } from "./canvas/range-template.mjs";
import { HellpiercersTemplateLayer } from "./canvas/template-layer.mjs";
import * as data from "./data/index.mjs";
import * as documents from "./documents/index.mjs";
import { RangeEditorApp } from "./sheets/dialogs/RangeEditorApp.mjs";
import * as sheets from "./sheets/index.mjs";
import { HumanSheet } from "./sheets/human-sheet.mjs";

globalThis.hellpiercers = {
  applications: { RangeEditorApp, sheets },
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

  CONFIG.ActiveEffect.legacyTransferral = false;

  // game.data.packs = game.data.packs.filter(i => i.name != "debugmacros");

  // Actors
  CONFIG.Actor.dataModels.human = data.HumanModel;
  CONFIG.Actor.dataModels.demon = data.DemonModel;
  CONFIG.Actor.dataModels.boss = data.BossModel;
  CONFIG.Actor.dataModels.faction = data.FactionModel;
  CONFIG.Actor.documentClass = documents.HellpiercersActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hellpiercers", sheets.HellpiercersActorSheet, {
    types: ["demon", "boss"],
    makeDefault: true,
    label: "HELLPIERCERS.ActorSheet",
  });
  Actors.registerSheet("hellpiercers", HumanSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.Human",
  });

  // Items
  CONFIG.Item.dataModels.ability = data.AbilityModel;
  CONFIG.Item.dataModels.weapon = data.WeaponModel;
  CONFIG.Item.dataModels.armor = data.ArmorModel;
  CONFIG.Item.dataModels.class = data.ClassModel;
  CONFIG.Item.dataModels.gear = data.GearModel;
  CONFIG.Item.documentClass = documents.HellpiercersItem;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hellpiercers", sheets.HellpiercersItemSheet, {
    // types: ["class", "armor", "weapon", "gear"],
    makeDefault: true,
    label: "HELLPIERCERS.ItemSheet",
  });

  // Templates
  CONFIG.Canvas.layers.templates.layerClass = HellpiercersTemplateLayer;
  CONFIG.MeasuredTemplate.objectClass = placeables.HellpiercersMeasuredTemplate;

  // Tokens
  CONFIG.Token.objectClass = placeables.HellpiercersToken;
  CONFIG.Token.hudClass = placeables.HellpiercersTokenHUD;
});
