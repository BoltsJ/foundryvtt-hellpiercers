<script>
  import { localize } from "#runtime/svelte/helper";
  import { HumanActor } from "../documents/human.mjs";
  import { TabStore } from "../util/stores.mjs";
  import { updateDoc } from "./actions/updatedoc.mjs";
  import NotesTab from "./components/NotesTab.svelte";
  import Portrait from "./components/Portrait.svelte";
  import TagEditor from "./components/TagEditor.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<HumanActor>}*/
  export let actor;

  const tabs = ["Notes", "HELLPIERCERS.Abilities", "DOCUMENT.Items", "HELLPIERCERS.Effects"];

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

      $actor.createEmbeddedDocuments("Item", [item]);
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
      <label for="system.pronouns">{localize("HELLPIERCERS.Pronouns")}:&nbsp</label>
      <input
        name="system.pronouns"
        value={$actor.system.pronouns}
        type="text"
        placeholder="any/all"
      />
    </div>
    <div class="flexrow">
      <label for="system.health.value">{localize("HELLPIERCERS.HP")}:&nbsp;</label>
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
        disabled={!!$actor.itemTypes.class.length}
      />
    </div>
    <div class="flexrow">
      <span>{localize("HELLPIERCERS.Tags")}:&nbsp;</span>
      <TagEditor bind:tagEditor document={actor} />
      {#each $actor.system.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
      <button type="button" class="tag-edit" on:click={() => (tagEditor = true)}>
        <i class="fas fa-edit"></i>
      </button>
    </div>
    <div class="flexrow">
      <label for="system.speed">{localize("HELLPIERCERS.Speed")}:&nbsp;</label>
      <input
        name="system.speed"
        value={$actor.system.speed}
        type="number"
        data-dtype="Number"
        min="1"
        disabled={!!$actor.itemTypes.armor.length}
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
    {:else if $current_tab === "DOCUMENT.Items"}
      <div id="items-tab" class="tab flexcol" role="tabpanel">
        {#each $actor.items as item}
          <div class="flexrow">
            <img
              src={item.img}
              alt="{item.name} icon"
              height="20"
              width="20"
              style="flex: 0 0 auto;"
            />
            <span>{item.name} &mdash; {item.type}</span>
            {#if item.type !== "gear"}
              <input
                type="checkbox"
                checked={item.system.equipped}
                on:change|stopPropagation={change =>
                  item.update({ "system.equipped": change.target.checked })}
              />
            {:else}
              <span style="width: 20px; height: 20px; flex: 0 0 20px; margin: 3px 5px;"></span>
            {/if}
            <button type="button" on:click={() => item.sheet.render(true)}>
              <i class="fas fa-edit"></i>
            </button>
            <button
              type="button"
              on:click={() => {
                item.deleteDialog();
              }}
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        {:else}
          <p>No items</p>
        {/each}
      </div>
    {:else if $current_tab === "HELLPIERCERS.Effects"}
      <div id="effects-tab" class="tab flexcol" role="tabpanel">
        {#each $actor.allApplicableEffects() as effect}
          <div class="flexrow">
            <img
              src={effect.img}
              alt="{effect.name} icon"
              height="20"
              width="20"
              style="flex: 0 0 auto;"
            />
            <span>{effect.name}</span>
            <input
              type="checkbox"
              checked={effect.disabled}
              on:change|stopPropagation={change =>
                effect.update({ disabled: change.target.checked })}
            />
            <button type="button" on:click={() => effect.sheet.render(true)}>
              <i class="fas fa-edit"></i>
            </button>
            <button
              type="button"
              on:click={() => {
                effect.sheet.close();
                effect.deleteDialog();
              }}
              disabled={effect.parent !== $actor}
            >
              <i class="fas fa-trash"></i>
            </button>
          </div>
        {/each}
        <div>
          <button
            type="button"
            on:click={() =>
              $actor.createEmbeddedDocuments("ActiveEffect", [
                { name: "New Effect", icon: "icons/svg/aura.svg" },
              ])}><i class="fa-solid fa-plus"></i></button
          >
        </div>
      </div>
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
