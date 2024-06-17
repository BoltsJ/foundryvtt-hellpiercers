import "./hellpiercers.scss";
import * as dataModels from "./data/index.mjs";
import * as documents from "./documents/index.mjs";
import * as sheets from "./sheets/index.mjs";
import { RangeEditorApp } from "./sheets/dialogs/RangeEditorApp.mjs";

globalThis.hellpiercers = {
  applications: { RangeEditorApp },
  dataModels,
  documents,
  sheets,
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
  CONFIG.Actor.dataModels.human = dataModels.HumanModel;
  CONFIG.Actor.dataModels.demon = dataModels.DemonModel;
  CONFIG.Actor.dataModels.boss = dataModels.BossModel;
  CONFIG.Actor.dataModels.faction = dataModels.FactionModel;
  CONFIG.Actor.documentClass = documents.BaseActorHellpiercers;
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("hellpiercers", sheets.HellpiercersActorSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.ActorSheet",
  });

  // Items
  CONFIG.Item.dataModels.weapon = dataModels.WeaponModel;
  CONFIG.Item.dataModels.armor = dataModels.ArmorModel;
  CONFIG.Item.dataModels.class = dataModels.ClassModel;
  CONFIG.Item.dataModels.gear = dataModels.GearModel;
  CONFIG.Item.documentClass = documents.BaseItemHellpiercers;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hellpiercers", sheets.HellpiercersItemSheet, {
    types: ["class", "armor", "weapon", "gear"],
    makeDefault: true,
    label: "HELLPIERCERS.ItemSheet",
  });
});
