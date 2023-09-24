import "./hellpiercers.scss";
import * as datamodels from "./modules/data/index.mjs";
import * as documents from "./modules/documents/index.mjs";
import * as sheets from "./modules/sheets/index.mjs";
// import BasicApplication from "./modules/view/BasicApllication.mjs";
// import * as util from "./modules/util/index.mjs"

globalThis.hellpiercers = {
  applications: {
    // test: BasicApplication,
  },
  datamodels,
  documents,
  sheets,
  util: {},
};

const ascii_logo = ` 
░█░█░█▀▀░█░░░█░░░█▀█░▀█▀░█▀▀░█▀▄░█▀▀░█▀▀░█▀▄░█▀▀
░█▀█░█▀▀░█░░░█░░░█▀▀░░█░░█▀▀░█▀▄░█░░░█▀▀░█▀▄░▀▀█
░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀
`;
Hooks.once("init", () => {
  console.log("hellpiercers | Initializing HELLPIERCERS System", ascii_logo);

  // Actors
  CONFIG.Actor.dataModels.human = datamodels.HumanModel;
  CONFIG.Actor.dataModels.demon = datamodels.DemonModel;
  CONFIG.Actor.dataModels.boss = datamodels.BossModel;
  CONFIG.Actor.dataModels.faction = datamodels.FactionModel;
  CONFIG.Actor.documentClass = documents.HellpiercersActorProxy;
  Actors.registerSheet("hellpiercers", sheets.HellpiercersActorSheet, {
    types: ["human"],
    makeDefault: true,
    label: "HELLPIERCERS.ActorSheet",
  });

  // Items
  CONFIG.Item.dataModels.weapon = datamodels.WeaponModel;
});
