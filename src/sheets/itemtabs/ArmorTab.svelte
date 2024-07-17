<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  // import TagEditor from "../components/TagEditor.svelte";
  import { getContext } from "svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Item>}*/
  export let item;

  let app = getContext("#external").application;

  // let tagEditor = false;
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
      readonly={!app.isEditable}
    />
  </div>
  <div class="flexcol">
    <span style="flex: 0 0 auto;">{localize("HELLPIERCERS.Movement")}</span>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.movement",
        editable: app.isEditable,
        enrichContent: true,
        initialSelection: "start",
      }}
    />
  </div>
  <!-- <div class="flexrow"> -->
  <!--   <span>{localize("HELLPIERCERS.Resistances")}:&nbsp;</span> -->
  <!--   <TagEditor bind:tagEditor document={item} path="system.resistances" /> -->
  <!--   {#each $item.system.resistances as resist} -->
  <!--     <span class="tag">{resist}</span> -->
  <!--   {/each} -->
  <!--   <button -->
  <!--     type="button" -->
  <!--     class="tag-edit" -->
  <!--     on:click={() => (tagEditor = true)} -->
  <!--     disabled={!app.isEditable} -->
  <!--   > -->
  <!--     <i class="fas fa-edit"></i> -->
  <!--   </button> -->
  <!-- </div> -->
  <div class="ability flexcol">
    <div class="flexrow">
      <label for="system.ability.name">{localize("HELLPIERCERS.SpecialName")}</label>
      <input
        name="system.ability.name"
        value={$item.system.ability.name}
        type="text"
        readonly={!app.isEditable}
      />
    </div>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.ability.description",
        editable: app.isEditable,
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
