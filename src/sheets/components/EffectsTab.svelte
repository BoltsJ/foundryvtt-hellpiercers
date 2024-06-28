<script>
  export let actor;
</script>

<div id="effects-tab" class="tab flexcol" role="tabpanel">
  {#each $actor.allApplicableEffects() as effect}
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
        on:change|stopPropagation={change => effect.update({ disabled: change.target.checked })}
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
        disabled={effect.parent !== $actor}
      >
        <i class="fas fa-trash"></i>
      </button>
    </div>
  {/each}
  <div>
    <button
      type="button"
      on:click={() =>
        $actor.createEmbeddedDocuments("ActiveEffect", [
          { name: "New Effect", icon: "icons/svg/aura.svg" },
        ])}><i class="fa-solid fa-plus"></i></button
    >
  </div>
</div>

<style lang="scss">
  div.tab {
    overflow: scroll;
    scrollbar-width: thin;
    scrollbar-color: black #00000000;
    div {
      flex: 0 0 auto;
    }
  }
</style>
