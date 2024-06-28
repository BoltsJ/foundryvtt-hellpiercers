import "./hellpiercers.scss";

import * as placeables from "./canvas/measured-template.mjs";
import { placeTemplate } from "./canvas/range-template.mjs";
import { HellpiercersTemplateLayer } from "./canvas/template-layer.mjs";
import * as data from "./data/index.mjs";
import * as documents from "./documents/index.mjs";
import { RangeEditorApp } from "./sheets/dialogs/RangeEditorApp.mjs";
import * as sheets from "./sheets/index.mjs";

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

  // Actors
  CONFIG.Actor.dataModels.human = data.HumanModel;
  CONFIG.Actor.dataModels.demon = data.DemonModel;
  CONFIG.Actor.dataModels.boss = data.BossModel;
  CONFIG.Actor.dataModels.faction = data.FactionModel;
  CONFIG.Actor.documentClass = documents.HellpiercersActor;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hellpiercers", sheets.HellpiercersActorSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.ActorSheet",
  });

  // Items
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
});
