<!-- This is necessary for Svelte to generate accessors TRL can access for `elementRoot` -->
<svelte:options accessors={true} />

<script>
  import { ApplicationShell } from "#runtime/svelte/component/core";
  import { localize } from "#runtime/svelte/helper"

  export let elementRoot;
</script>

<!-- ApplicationShell provides the popOut / application shell frame, header bar, content areas -->
<!-- ApplicationShell exports `elementRoot` which is the outer application shell element -->
<ApplicationShell bind:elementRoot>
  <main>
    <h1>{localize("HELLPIERCERS.title")}</h1>
  </main>
</ApplicationShell>

<style lang="scss">
  main {
    text-align: center;
    display: flex;
    flex-direction: column;
  }
</style>
