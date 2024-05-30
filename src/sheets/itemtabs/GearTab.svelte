<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  // import TagEditor from "../components/TagEditor.svelte";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Item>}*/
  export let item;

  // let tagEditor = false;
</script>

<div class="tab flexcol" role="tabpanel">
  <div class="flexrow">
    <label for="system.kind">{localize("HELLPIERCERS.GearKind")}:&nbsp;</label>
    <select name="system.kind">
      <option value="weapon" selected={$item.system.kind === "weapon"}>
        {localize("TYPES.Item.weapon")}
      </option>
      <option value="armor" selected={$item.system.kind === "armor"}>
        {localize("TYPES.Item.armor")}
      </option>
    </select>
  </div>
  <div class="flexrow">
    <label for="system.target">{localize("HELLPIERCERS.GearTarget")}&nbsp;</label>
    <select name="system.target" disabled={!$item.isOwned}>
      <option value="" selected={$item.system.target === ""}>
        {localize("None")}
      </option>
      {#each $item.parent?.itemTypes[$item.system.kind] ?? [] as i}
        <option value={i.id} selected={$item.system.target === i.id}>
          {i.name}
        </option>
      {/each}
    </select>
  </div>
  <div class="ability flexcol">
    <div class="flexrow">
      {localize("HELLPIERCERS.Effect")}
    </div>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.effect",
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
