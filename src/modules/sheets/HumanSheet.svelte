<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  import { getContext } from "svelte";
  import { TabStore } from "../util/stores.mjs";
  import TagEditor from "./TagEditor.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Actor>}*/
  let actor = getContext("tjs_doc");
  /** @type {HTMLFormElement} */
  let form;

  const tabs = ["Notes", "DOCUMENT.Items"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);

  let tagEditor = false;

  /** @param {Event} change */
  function update(change) {
    const target = change.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const data_type = target.dataset.dtype;
    $actor.update({ [target.name]: data_type === "Number" ? parseFloat(value) : value });
  }

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

<form bind:this={form} class="flexcol" autocomplete="off" method="dialog">
  <header>
    <div class="nameplate flexrow">
      <label for="name">{localize("Name")}:&nbsp;</label>
      <input type="text" name="name" value={$actor.name} on:change={update} />
    </div>
    <div class="bar-display flexrow">
      <label for="system.health.value">{localize("HELLPIERCERS.HP")}:&nbsp;</label>
      <input
        type="number"
        name="system.health.value"
        data-dtype="Number"
        max={$actor.system.health.max}
        min="0"
        value={$actor.system.health.value}
        on:change={update}
      />
      /
      <input
        type="number"
        name="system.health.max"
        data-dtype="Number"
        min="0"
        disabled={!!$actor.itemTypes.class.length}
        value={$actor.system.health.max}
        on:change={update}
      />
    </div>
    <div class="tag-list flexrow">
      <span>{localize("HELLPIERCERS.Tags")}:</span>
      <TagEditor bind:tagEditor document={actor} />
      {#each $actor.system.tags as tag}
        <span class="tag">{tag}</span>
      {/each}
      <button type="button" class="tag-edit" on:click={() => (tagEditor = true)}>
        <i class="fas fa-edit"></i>
      </button>
    </div>
  </header>

  <nav class="tabs flexrow">
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
  </nav>

  <section class="tab-content flexcol">
    {#if $current_tab === "Notes"}
      <TJSTinyMCE options={pm_opts} />
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
          text-align: center;
        }
      }
      .tag-list {
        * {
          flex: 0 0 auto;
        }
        .tag {
          border: 1px solid #00000030;
          background: #00000030;
          border-radius: 0.25rem;
          padding: 0 0.25rem;
        }
        .tag-edit {
          flex: 0 0 auto;
          width: auto;
          line-height: normal;
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          &:hover,
          &:focus {
            box-shadow: none;
            text-shadow: 0 0 8px var(--color-shadow-primary);
          }
          &:active {
            box-shadow: none;
            text-shadow: 0 0 8px var(--color-shadow-primary);
          }
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
          text-shadow: 0 0 8px var(--color-shadow-primary);
        }
        &.active {
          text-decoration: underline;
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
  }
</style>
