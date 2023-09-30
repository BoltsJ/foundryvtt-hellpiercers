<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { localize } from "#runtime/svelte/helper";
  import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
  import { getContext } from "svelte";
  import { slide } from "svelte/transition";
  import { TabStore } from "../util/stores.mjs";
  import ArmorTab from "./ArmorTab.svelte";
  import ClassTab from "./ClassTab.svelte";
  import { updateDoc } from "./actions/updatedoc.mjs";
  import NotesTab from "./components/NotesTab.svelte";
  import Portrait from "./components/Portrait.svelte";

  export let elementRoot;

  const external = getContext("#external");
  let item = new TJSDocument(external.application.item);

  const tabs = ["Description", "HELLPIERCERS.ItemDetails", "HELLPIERCERS.Effects"];
  let current_tab = TabStore.get($item.uuid, tabs[0]);

  $: external.application.reactive.title =
    $item.name + ($item.isToken ? ` [${localize("Token")}]` : "");

  const sheets = {
    ["class"]: ClassTab,
    ["armor"]: ArmorTab,
  };
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
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
        <svelte:component this={sheets[$item.type]} {item} />
      {:else if $current_tab === "HELLPIERCERS.Effects"}
        <div class="tab flexcol">
          {#each $item.effects as effect}
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
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          {/each}
          <div>
            <button
              type="button"
              on:click={() =>
                $item.createEmbeddedDocuments("ActiveEffect", [
                  { name: "New Effect", icon: $item.img },
                ])}
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      {:else}
        <div class="tab" role="tabpanel">
          <p>Not implemented</p>
        </div>
      {/if}
    </section>
  </main>
</TJSApplicationShell>

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
