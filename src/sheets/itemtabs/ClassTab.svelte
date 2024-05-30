<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Item>}*/
  export let item;
</script>

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
  <div class="ability flexcol">
    <div class="flexrow">
      <label for="system.active.name">{localize("HELLPIERCERS.ActiveName")}</label>
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
      <label for="system.passive.name">{localize("HELLPIERCERS.PassiveName")}</label>
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

<style lang="scss">
  div.tab {
    .flexrow {
      flex: 0 0 auto;
    }
  }
</style>
