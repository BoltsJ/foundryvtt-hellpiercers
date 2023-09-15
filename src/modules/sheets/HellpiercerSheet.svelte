<script>
  import { getContext } from "svelte";
  import { TJSProseMirror } from "#standard/component";
  import { localize } from "#runtime/svelte/helper";
  import { TabStore } from "../util/stores.mjs";
  import { updateDoc } from "../util/updatedoc.mjs";

  let actor = getContext("tjs_doc");

  const tabs = ["Notes", "DOCUMENT.Items"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);

  let pm_opts;
  $: pm_opts = {
    document: $actor,
    fieldName: "system.biography",
    collaborate: true,
    editable: true,
    enrichContent: true,
    initialSelection: "start",
  };
</script>

<main class="flexcol">
  <header>
    <div class="nameplate flexrow">
      <label for="name">{localize("Name")}:&nbsp;</label>
      <input type="text" name="name" use:updateDoc />
    </div>
    <div class="bar-display flexrow">
      <label for="system.health.value">{localize("HELLPIERCERS.HP")}:&nbsp;</label>
      <input
        type="number"
        name="system.health.value"
        data-dtype="Number"
        max={$actor.system.health.max}
        min="0"
        use:updateDoc
      />
      /
      <input type="number" name="system.health.max" data-dtype="Number" disabled use:updateDoc />
    </div>
  </header>

  <div class="tabs flexrow">
    {#each tabs as tab}
      <button class="tab" class:active={tab === $current_tab} on:click={() => ($current_tab = tab)}>
        {localize(tab)}
      </button>
    {/each}
  </div>

  <section class="tab-content flexcol">
    {#if $current_tab === "Notes"}
      <h3>{localize("Notes")}:</h3>
      <TJSProseMirror options={pm_opts} />
    {:else if $current_tab === "DOCUMENT.Items"}
      AAA
    {/if}
  </section>
</main>

<style lang="scss">
  // * {
  //   border: 1px dotted red !important;
  // }
  main {
    height: 100%;
    flex: 0 0 100%;
    header {
      flex: 0 1 auto;
      // background: lightcoral;
      .nameplate {
        label {
          flex: 0 0 auto;
        }
      }
      .bar-display {
        label {
          flex: 0 0 auto;
        }
        input {
          flex: 0 0 2rem;
        }
      }
    }
    div.tabs {
      button.tab {
        flex: 0 1 10rem;
        background: none;
        border: none;
        font-size: large;
        &:hover,
        &:focus {
          box-shadow: none;
        }
        &.active {
          text-shadow: 0 0 8px var(--color-shadow-primary);
        }
      }
    }
    .tab-content {
      flex: 0 1 100%;
      height: 100%;
      overflow: scroll;
      // background: lightblue;
      h3 {
        flex: 0 0 auto;
      }
    }
  }
</style>
