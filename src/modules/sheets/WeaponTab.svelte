<script>
  import { localize } from "#runtime/svelte/helper";
  import { TJSTinyMCE } from "#standard/component";

  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Item>}*/
  export let item;
</script>

<div class="tab flexcol" role="tabpanel">
  <div class="flexrow">
    <label>
      {localize("HELLPIERCERS.WeaponDamage")}
      <input name="system.damage" value={$item.system.damage} type="text" placeholder="0 + 1d6" />
    </label>
  </div>
  <div>
    <span>{localize("HELLPIERCERS.WeaponRange")}</span>
    <div>{@html $item.rangeSvg.outerHTML}</div>
    <!-- <pre>{$item.rangeGrid.map(a => a.join("")).join("\n")}</pre> -->
  </div>
  <div class="ability flexcol">
    <div class="flexrow">
      <label>
        {localize("HELLPIERCERS.WeaponAbility")}
        <input
          name="system.ability.name"
          value={$item.system.ability.name}
          type="text"
          placeholder={localize("HELLPIERCERS.WeaponAbility")}
        />
      </label>
    </div>
    <div class="flexrow">
      <label for="system.ability.kind">
        {localize("HELLPIERCERS.WeaponAbilityActivation")}
        <select name="system.ability.kind" value={$item.system.ability.kind}>
          <option value="trigger">{localize("HELLPIERCERS.WeaponTrigger")}</option>
          <option value="action">{localize("HELLPIERCERS.WeaponAction")}</option>
        </select>
      </label>
    </div>
    <TJSTinyMCE
      options={{
        document: $item,
        fieldName: "system.ability.description",
        editable: true,
        enrichContent: true,
        initialSelection: "start",
      }}
    />
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
