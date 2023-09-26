<script>
  import { localize } from "#runtime/svelte/helper";
  import { TabStore } from "../util/stores.mjs";
  import TagEditor from "./TagEditor.svelte";
  import BiographyTab from "./components/BiographyTab.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Actor>}*/
  export let actor;

  const tabs = ["Notes", "DOCUMENT.Items"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);

  let tagEditor = false;

  /** @param {Event} change */
  function update(change) {
    /** @type {HTMLInputElement} */
    const target = change.target;
    if (!foundry.utils.hasProperty($actor, target.name)) return;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const data_type = target.dataset.dtype;
    $actor.update({ [target.name]: data_type === "Number" ? parseFloat(value) : value });
  }

  /** @param {DragEvent} drop */
  async function handleDrop(drop) {
    const dropdata = drop.dataTransfer.getData("text/plain") ?? "";
    try {
      const { type: doctype, uuid } = JSON.parse(dropdata);
      if (doctype !== "Item") return;

      const item = await fromUuid(uuid);

      $actor.createEmbeddedDocuments("Item", [item]);
    } catch (_) {
      console.warn("Invalid Drop data.");
    }
  }
</script>

<main on:change={update} class="flexcol" autocomplete="off" on:drop|preventDefault={handleDrop}>
  <header>
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

  <section class="sheetbody flexcol" role="tabpanel">
    {#if $current_tab === "Notes"}
      <BiographyTab {actor} />
    {:else if $current_tab === "DOCUMENT.Items"}
      <div id="items-tab" class="flexcol" role="tabpanel">
        {#each $actor.items as item}
          <div class="flexrow">
            <span>{item.name} &mdash; {item.type}</span>
            <button type="button" on:click={() => item.sheet.render(true)}>
              <i class="fas fa-edit"></i>
            </button>
            <button type="button" on:click={() => item.deleteDialog()}>
              <i class="fas fa-trash"></i>
            </button>
          </div>
        {:else}
          <p>No items</p>
        {/each}
      </div>
    {/if}
  </section>
</main>

<style lang="scss">
  main {
    height: 0%;
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
      #items-tab {
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
