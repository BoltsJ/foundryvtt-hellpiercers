import "./hellpiercers.scss";
import * as documents from "./modules/documents/index.mjs";
import * as datamodels from "./modules/data/index.mjs";
import * as sheets from "./modules/sheets/index.mjs";
import BasicApplication from "./modules/view/BasicApllication.mjs";

const ascii_logo = `\
░█░█░█▀▀░█░░░█░░░█▀█░▀█▀░█▀▀░█▀▄░█▀▀░█▀▀░█▀▄░█▀▀
░█▀█░█▀▀░█░░░█░░░█▀▀░░█░░█▀▀░█▀▄░█░░░█▀▀░█▀▄░▀▀█
░▀░▀░▀▀▀░▀▀▀░▀▀▀░▀░░░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░▀░▀░▀▀▀
`;
Hooks.once("init", () => {
  console.log("hellpiercers | Initializing HELLPIERCERS System", ascii_logo);

  globalThis.hellpiercers = {
    applications: {
      test: BasicApplication,
    },
    datamodels,
    documents,
    util: {},
  };

  // Actors
  CONFIG.Actor.dataModels.hellpiercer = datamodels.actors.HellpiecerModel;
  CONFIG.Actor.documentClass = documents.HellpiercersActorProxy;
  Actors.registerSheet("hellpiercers", sheets.TJSActorSheet, {
    types: ["hellpiercer"],
    makeDefault: true,
  });

  // Items
  CONFIG.Item.dataModels.weapon = datamodels.items.WeaponModel;
});
