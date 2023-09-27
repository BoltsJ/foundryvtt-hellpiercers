<script>
  import { localize } from "#runtime/svelte/helper";
  import { TabStore } from "../util/stores.mjs";
  import TagEditor from "./components/TagEditor.svelte";
  import { updateDoc } from "./actions/updatedoc.mjs";
  import NotesTab from "./components/NotesTab.svelte";
  import Portrait from "./components/Portrait.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Actor>}*/
  export let item;

  const tabs = ["Description", "HELLPIERCERS.ItemDetails"];

  let current_tab = TabStore.get($item.uuid, tabs[0]);

  let tagEditor = false;
</script>

<main class="flexcol" autocomplete="off" use:updateDoc>
  <header>
    <Portrait document={item} />
    <div class="flexrow">
      <label for="name">{localize("Name")}:&nbsp;</label><input
        name="name"
        value={$item.name}
        type="text"
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
    {#if $current_tab === "Description"}
      <NotesTab document={item} property="system.description" />
    {:else if $current_tab === "HELLPIERCERS.ItemDetails"}
      <div class="tab flexcol" role="tabpanel">
        <div class="flexrow">
          <label for="system.health">{localize("HELLPIERCERS.HP")}:&nbsp;</label>
          <input
            name="system.health"
            value={$item.system.health}
            type="number"
            data-dtype="Number"
            min="0"
          />
        </div>
      </div>
    {:else}
      <div class="tab" role="tabpanel">
        <p>Not implemented</p>
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
    }
  }
</style>
