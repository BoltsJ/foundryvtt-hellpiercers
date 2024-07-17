<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";
  import { RangeEditorApp } from "../dialogs/RangeEditorApp.mjs";

  /** @typedef {import("../../documents/weapon.mjs").HellpiercersWeapon} HellpiercersWeapon */
  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<HellpiercersWeapon>}*/
  export let item;
</script>

<div class="tab flexcol" role="tabpanel">
  <div class="flexrow">
    <label>
      {localize("HELLPIERCERS.ITEM.FIELDS.damage.label")}
      <input name="system.damage" value={$item.system.damage} type="text" placeholder="0 + 1d6" />
    </label>
  </div>
  {#each $item.system.range as range, i}
    <div class="flexrow">
      <span>{range.label}</span>
      <!-- eslint-disable-next-line svelte/no-at-html-tags -->
      <div>{@html range.svg.outerHTML}</div>
      <!-- <pre>{range.rangeGrid.map(a => a.join("")).join("\n")}</pre> -->
      <button
        type="button"
        on:click={() => {
          new RangeEditorApp($item, i).render(true);
        }}><i class="fa-solid fa-edit" /></button
      >
    </div>
  {/each}
  <div class="ability flexcol">
    <div class="ability flexcol">
      <div class="flexrow">
        <label for="system.active.name"
          >{localize("HELLPIERCERS.ITEM.FIELDS.active.name.label")}</label
        >
        <input
          name="system.active.name"
          value={$item.system.active.name}
          type="text"
          placeholder={localize("HELLPIERCERS.ActiveName")}
        />
      </div>
      <TJSTinyMCE
        options={{
          document: $item,
          fieldName: "system.active.description",
          editable: true,
          enrichContent: true,
          initialSelection: "start",
        }}
      />
    </div>
    <div class="ability flexcol">
      <div class="flexrow">
        <label for="system.passive.name"
          >{localize("HELLPIERCERS.ITEM.FIELDS.passive.name.label")}</label
        >
        <input
          name="system.passive.name"
          value={$item.system.passive.name}
          type="text"
          placeholder={localize("HELLPIERCERS.PassiveName")}
        />
      </div>
      <TJSTinyMCE
        options={{
          document: $item,
          fieldName: "system.passive.description",
          editable: true,
          enrichContent: true,
          initialSelection: "start",
        }}
      />
    </div>
  </div>
</div>

<style lang="scss">
  div.tab {
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: black #00000000;
    .flexrow {
      flex: 0 0 auto;
    }
  }
</style>
