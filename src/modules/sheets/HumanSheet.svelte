<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSProseMirror } from "#standard/component";
  import { getContext } from "svelte";
  import { TabStore } from "../util/stores.mjs";
  import { updateDoc } from "../util/updatedoc.mjs";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Actor>}*/
  let actor = getContext("tjs_doc");

  const tabs = ["Notes", "DOCUMENT.Items"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);
  let form;

  $: console.log(form);
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

<form class="flexcol" autocomplete="off" method="dialog" use:updateDoc={actor}>
  <header>
    <div class="nameplate flexrow">
      <label for="name">{localize("Name")}:&nbsp;</label>
      <input type="text" name="name" />
    </div>
    <div class="bar-display flexrow">
      <label for="system.health.value">{localize("HELLPIERCERS.HP")}:&nbsp;</label>
      <input
        type="number"
        name="system.health.value"
        data-dtype="Number"
        max={$actor.system.health.max}
        min="0"
      />
      /
      <input
        type="number"
        name="system.health.max"
        data-dtype="Number"
        min="0"
        disabled={!!$actor.itemTypes.class.length}
      />
    </div>
  </header>

  <nav class="tabs flexrow">
    {#each tabs as tab}
      <button
        type="button"
        class="tab"
        class:active={tab === $current_tab}
        on:click={() => ($current_tab = tab)}
      >
        {localize(tab)}
      </button>
    {/each}
  </nav>

  <section class="tab-content flexcol">
    {#if $current_tab === "Notes"}
      <TJSProseMirror options={pm_opts} />
    {:else if $current_tab === "DOCUMENT.Items"}
      {#each $actor.items as item}
        <p>{item.name}</p>
      {:else}
        <p>No items</p>
      {/each}
    {/if}
  </section>
</form>

<style lang="scss">
  // * {
  //   border: 1px dotted red !important;
  // }
  form {
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
    nav.tabs {
      button.tab {
        flex: 0 1 auto;
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
      // h4 {
      //   flex: 0 0 auto;
      // }
    }
    :global(.editor .menu) {
      position: absolute;
    }
  }
</style>
