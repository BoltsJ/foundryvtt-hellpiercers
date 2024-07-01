<script>
  import { localize } from "#runtime/svelte/helper";
  import { getContext } from "svelte";
  import { TabStore } from "../util/stores.mjs";
  import { updateDoc } from "./actions/updatedoc.mjs";
  import EffectsTab from "./components/EffectsTab.svelte";
  import NotesTab from "./components/NotesTab.svelte";
  import Portrait from "./components/Portrait.svelte";
  import TagEditor from "./components/TagEditor.svelte";

  import { placeTemplate } from "../canvas/range-template.mjs";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<import("../documents/baseactor.mjs").HellpiercersActor>} */
  export let actor;

  const application = getContext("#external").application;

  const tabs = ["HELLPIERCERS.Abilities", "DOCUMENT.Items", "Notes", "HELLPIERCERS.Effects"];

  let current_tab = TabStore.get($actor.uuid, tabs[0]);

  let tagEditor = false;

  function isEquipped(item) {
    switch (item.type) {
      case "weapon":
        return $actor.system.weapon?.id === item.id;
      case "class":
        return $actor.system.class?.id === item.id;
      case "armor":
        return $actor.system.armor?.id === item.id;
      default:
        return false;
    }
  }

  /** @param {DragEvent} drop */
  async function handleDrop(drop) {
    const dropdata = drop.dataTransfer.getData("text/plain");
    try {
      /** @type {{ type: string,, uuid: string }} */
      const { type: doctype, uuid } = JSON.parse(dropdata);
      if (doctype !== "Item") return;

      if ($actor.items.map(i => i.uuid).includes(uuid)) return;
      const item = await fromUuid(uuid);

      let [created] = await $actor.createEmbeddedDocuments("Item", [item]);
      if (["armor", "class", "weapon"].includes(item.type)) {
        await $actor.update({ [`system.${item.type}`]: created });
      }
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
      <label for="system.pronouns"
        >{localize("HELLPIERCERS.ACTOR.FIELDS.pronouns.label")}:&nbsp</label
      >
      <input
        name="system.pronouns"
        value={$actor.system.pronouns}
        type="text"
        placeholder="any/all"
      />
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
        disabled
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
        disabled
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
    {#if $current_tab === "HELLPIERCERS.Abilities"}
      <div id="abilities-tab" class="tab flexcol" role="tabpanel">
        <div
          class="weapon flexrow"
          draggable="true"
          role="region"
          on:dragstart={ev => {
            ev.dataTransfer.setData(
              "text/plain",
              JSON.stringify($actor.system.weapon?.toDragData())
            );
          }}
        >
          {#if $actor.system.weapon != null}
            <span>{$actor.system.weapon.name}</span>
            <!-- svelte-ignore missing-declaration -->
            <button
              type="button"
              style="flex: 0 0 5rem; height: 2rem;"
              on:click={async () => {
                const r = new Roll($actor.system.weapon.system.damage);
                await r.evaluate();
                await r.toMessage();
              }}><i class="fas fa-dice"></i>{$actor.system.weapon.system.damage}</button
            >
            {#each $actor.system.weapon?.system.range ?? [] as range}
              <button
                style="width:2rem; height: 2rem; flex:0 0 auto"
                type="button"
                on:click={() => {
                  application.minimize();
                  placeTemplate(range, $actor).finally(() => application.maximize());
                }}><i class="fa-solid fa-ruler-combined"></i></button
              >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <div>{@html range.svg.outerHTML}</div>
            {/each}
          {:else}
            No Weapon Equipped
          {/if}
        </div>
      </div>
    {:else if $current_tab === "Notes"}
      <NotesTab document={actor} />
    {:else if $current_tab === "DOCUMENT.Items"}
      <div id="items-tab" class="tab flexcol" role="tabpanel">
        {#each ["class", "armor", "weapon", "gear"] as itemType}
          {#each $actor.itemTypes[itemType] as item}
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
                  checked={isEquipped(item)}
                  on:change|stopPropagation={change => {
                    if (item.type === "class")
                      $actor.update({ "system.class": change.currentTarget.checked ? item : null });
                    if (item.type === "armor")
                      $actor.update({ "system.armor": change.currentTarget.checked ? item : null });
                    if (item.type === "weapon")
                      $actor.update({
                        "system.weapon": change.currentTarget.checked ? item : null,
                      });
                  }}
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
        {/each}
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
    .weapon * {
      border: 1px solid red;
    }
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
