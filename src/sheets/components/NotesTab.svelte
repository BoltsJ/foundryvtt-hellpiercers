<script>
  import { TJSTinyMCE } from "#standard/component";

  export let document;
  export let property = "system.biography";

  let options = {
    document: $document,
    fieldName: property,
    collaborate: true,
    editable: true,
    enrichContent: true,
    initialSelection: "start",
  };
</script>

<div class="tab" role="tabpanel">
  <TJSTinyMCE {options} />
</div>

<style lang="scss">
  div.tab {
    overflow: scroll;
    :global(.editor-content) {
      scrollbar-width: thin;
    }
  }
</style>
