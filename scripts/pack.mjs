#!/usr/bin/env node
// https://discord.com/channels/170995199584108546/1090432971850403952/1152119148130881556
import { compilePack } from "@foundryvtt/foundryvtt-cli";
import { promises as fs } from "fs";

const MODULE_ID = process.cwd();

const packs = await fs.readdir("./src/packs");
for (const pack of packs) {
  if (pack === ".gitattributes") continue;
  console.log("Packing " + pack);
  await compilePack(`${MODULE_ID}/src/packs/${pack}`, `${MODULE_ID}/dist/packs/${pack}`, {
    yaml: true,
    log: true,
  });
}
