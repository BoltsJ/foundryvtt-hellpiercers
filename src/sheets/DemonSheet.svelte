<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  import { TabStore } from "../util/stores.mjs";
  import { updateDoc } from "./actions/updatedoc.mjs";
  import EffectsTab from "./components/EffectsTab.svelte";
  import NotesTab from "./components/NotesTab.svelte";
  import Portrait from "./components/Portrait.svelte";
  import TagEditor from "./components/TagEditor.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<import("../documents/baseactor.mjs").HellpiercersActor>} */
  export let actor;

  const tabs = ["Notes", "HELLPIERCERS.Abilities", "HELLPIERCERS.Effects"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);

  let tagEditor = false;

  /** @param {DragEvent} drop */
  async function handleDrop(drop) {
    const dropdata = drop.dataTransfer.getData("text/plain");
    try {
      /** @type {{ type: string,, uuid: string }} */
      const { type: doctype, uuid } = JSON.parse(dropdata);
      if (doctype !== "Item") return;

      const item = await fromUuid(uuid);

      let [created] = await $actor.createEmbeddedDocuments("Item", [item]);
      await $actor.update({ [`system.${item.type}`]: created });
    } catch (_) {
      console.warn("Invalid Drop data.");
    }
  }
</script>

<main class="flexcol" autocomplete="off" on:drop|preventDefault={handleDrop} use:updateDoc>
  <header>
    <Portrait document={actor} />
    <div class="flexrow">
      <label for="name">{localize("Name")}:&nbsp;</label>
      <input name="name" value={$actor.name} type="text" />
    </div>
    <div class="flexrow">
      <label for="system.health.value"
        >{localize("HELLPIERCERS.ACTOR.FIELDS.health.label")}:&nbsp;</label
      >
      <input
        name="system.health.value"
        value={$actor.system.health.value}
        type="number"
        data-dtype="Number"
        max={$actor.system.health.max}
        min="0"
      />
      /
      <input
        name="system.health.max"
        value={$actor.system.health.max}
        type="number"
        data-dtype="Number"
        min="0"
      />
    </div>
    <div class="flexrow">
      <span>{localize("HELLPIERCERS.ACTOR.FIELDS.tags.label")}:&nbsp;</span>
      <TagEditor bind:tagEditor document={actor} />
      {#each $actor.system.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
      <button type="button" class="tag-edit" on:click={() => (tagEditor = true)}>
        <i class="fas fa-edit"></i>
      </button>
    </div>
    <div class="flexrow">
      <label for="system.speed">{localize("HELLPIERCERS.ACTOR.FIELDS.speed.label")}:&nbsp;</label>
      <input
        name="system.speed"
        value={$actor.system.speed}
        type="number"
        data-dtype="Number"
        min="1"
      />
    </div>
    <div class="flexrow">
      <label for="system.scale">{localize("HELLPIERCERS.ACTOR.FIELDS.scale.label")}:&nbsp;</label>
      <input
        name="system.scale"
        value={$actor.system.scale}
        type="number"
        data-dtype="Number"
        min="1"
      />
    </div>
  </header>

  <div class="tabs flexrow" role="tablist">
    {#each tabs as tab}
      <button
        role="tab"
        type="button"
        class="tab"
        class:active={tab === $current_tab}
        on:click={() => ($current_tab = tab)}
      >
        {localize(tab)}
      </button>
    {/each}
  </div>

  <section class="sheetbody flexcol">
    {#if $current_tab === "Notes"}
      <NotesTab document={actor} />
    {:else if $current_tab === "HELLPIERCERS.Abilities"}
      <div id="items-tab" class="tab flexcol" role="tabpanel">
        <div class="flexcol" style="flex: 1 0 5rem">
          <span style="flex: 0 0 auto">{localize("HELLPIERCERS.ACTOR.FIELDS.strike.label")}</span>
          <div class="flexrow">
            <label for="system.strike.name"
              >{localize("HELLPIERCERS.ACTOR.FIELDS.strike.name.label")}:&nbsp;
            </label>
            <input name="system.strike.name" value={$actor.system.strike.name} type="text" />
          </div>
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          <div>{@html $actor.system.strike.range.svg.outerHTML}</div>
          <TJSTinyMCE
            options={{
              document: $actor,
              fieldName: "system.strike.description",
              editable: true,
              enrichContent: true,
              initialSelection: "start",
            }}
          />
        </div>
        <div class="flexcol" style="flex: 1 0 5rem">
          <span style="flex: 0 0 auto">{localize("HELLPIERCERS.ACTOR.FIELDS.special.label")}</span>
          <div class="flexrow">
            <label for="system.strike.name"
              >{localize("HELLPIERCERS.ACTOR.FIELDS.strike.name.label")}:&nbsp;
            </label>
            <input name="system.special.name" value={$actor.system.special.name} type="text" />
          </div>
          <TJSTinyMCE
            options={{
              document: $actor,
              fieldName: "system.special.description",
              editable: true,
              enrichContent: true,
              initialSelection: "start",
            }}
          />
        </div>
      </div>
    {:else if $current_tab === "HELLPIERCERS.Effects"}
      <EffectsTab {actor} />
    {:else}
      <p>Not implemented</p>
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    label {
      flex: 0 0 auto;
    }
    height: 100%;
    flex: 1 0 auto;
    overflow: unset;
    header {
      flex: 0 0 auto;
    }
    div.tabs {
      flex: 0 0 auto;
    }
    .sheetbody {
      flex: 1 0 auto;
      height: 0%;
      max-height: 100%;
      div.tab {
        overflow: scroll;
        scrollbar-width: thin;
        scrollbar-color: black #00000000;
        div {
          flex: 0 0 auto;
        }
      }
    }
  }
</style>
