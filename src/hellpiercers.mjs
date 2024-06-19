import "./hellpiercers.scss";
import * as data from "./data/index.mjs";
import * as documents from "./documents/index.mjs";
import * as sheets from "./sheets/index.mjs";
import { RangeEditorApp } from "./sheets/dialogs/RangeEditorApp.mjs";

globalThis.hellpiercers = {
  applications: { RangeEditorApp, sheets },
  data,
  documents,
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
  CONFIG.Actor.documentClass = documents.BaseActorHellpiercers;
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
  CONFIG.Item.documentClass = documents.BaseItemHellpiercers;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("hellpiercers", sheets.HellpiercersItemSheet, {
    types: ["class", "armor", "weapon", "gear"],
    makeDefault: true,
    label: "HELLPIERCERS.ItemSheet",
  });
});
