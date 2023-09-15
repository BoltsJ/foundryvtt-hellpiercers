import { SvelteApplication } from "#runtime/svelte/application";
import { TJSDocument } from "#runtime/svelte/store/fvtt/document";
import ActorSheetAppShell from "./ActorSheetAppShell.svelte";

export default class TJSActorSheet extends SvelteApplication {
  /** @inheritdoc */
  constructor(actor, options = {}) {
    super(
      foundry.utils.mergeObject(
        {
          id: `doc_${actor.uuid.replaceAll(".", "_")}`,
          title: actor.name + (actor.isToken ? " [TOKEN]" : ""),
          svelte: {
            props: {
              actor: new TJSDocument(actor),
            },
          },
        },
        options
      )
    );
    this.doc = actor;
  }

  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["hellpiercers", "sheet", "actor"],
      resizable: true,
      width: 600,
      height: 600,
      minimizable: true,
      svelte: {
        class: ActorSheetAppShell,
        target: document.body,
        intro: true,
      },
    });
  }
}
