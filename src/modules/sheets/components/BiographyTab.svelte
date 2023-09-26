<script>
  import { TJSTinyMCE } from "#standard/component";

  export let actor;

  let options = {
    document: $actor,
    fieldName: "system.biography",
    collaborate: true,
    editable: true,
    enrichContent: true,
    initialSelection: "start",
  };
</script>

<div class="tab" role="tabpanel">
  <TJSTinyMCE {options} />
</div>
