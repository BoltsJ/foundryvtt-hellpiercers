<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  import TagEditor from "../components/TagEditor.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Item>}*/
  export let item;

  let tagEditor = false;
</script>

<div class="tab flexcol" role="tabpanel">
  <div class="flexrow">
    <label for="system.speed">{localize("HELLPIERCERS.Speed")}:&nbsp;</label>
    <input
      name="system.speed"
      value={$item.system.speed}
      type="number"
      data-dtype="Number"
      min="0"
    />
  </div>
  <div class="flexcol">
    <span style="flex: 0 0 auto;">{localize("HELLPIERCERS.Movement")}</span>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.movement",
        editable: true,
        enrichContent: true,
        initialSelection: "start",
      }}
    />
  </div>
  <div class="flexrow">
    <span>{localize("HELLPIERCERS.Resistances")}:&nbsp;</span>
    <TagEditor bind:tagEditor document={item} path="system.resistances" />
    {#each $item.system.resistances as resist}
      <span class="tag">{resist}</span>
    {/each}
    <button type="button" class="tag-edit" on:click={() => (tagEditor = true)}>
      <i class="fas fa-edit"></i>
    </button>
  </div>
  <div class="ability flexcol">
    <div class="flexrow">
      <label for="system.special.name">{localize("HELLPIERCERS.SpecialName")}</label>
      <input name="system.special.name" value={$item.system.special.name} type="text" />
    </div>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.special.description",
        editable: true,
        enrichContent: true,
        initialSelection: "start",
      }}
    />
  </div>
</div>

<style lang="scss">
  div.tab {
    .flexrow {
      flex: 0 0 auto;
    }
  }
</style>
