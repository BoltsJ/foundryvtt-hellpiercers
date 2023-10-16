import "./hellpiercers.scss";
import * as dataModels from "./modules/data/index.mjs";
import * as documents from "./modules/documents/index.mjs";
import * as sheets from "./modules/sheets/index.mjs";

globalThis.hellpiercers = {
  applications: {},
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
  CONFIG.Actor.documentClass = documents.HellpiercersActorProxy;
  Actors.registerSheet("hellpiercers", sheets.HellpiercersActorSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.ActorSheet",
  });

  // Items
  CONFIG.Item.dataModels.weapon = dataModels.WeaponModel;
  CONFIG.Item.dataModels.armor = dataModels.ArmorModel;
  CONFIG.Item.dataModels.class = dataModels.ClassModel;
  CONFIG.Item.documentClass = documents.HellpiercersItemProxy;
  Items.registerSheet("hellpiercers", sheets.HellpiercersItemSheet, {
    types: ["class", "armor", "weapon"],
    makeDefault: true,
    label: "HELLPIERCERS.ItemSheet",
  });
});
