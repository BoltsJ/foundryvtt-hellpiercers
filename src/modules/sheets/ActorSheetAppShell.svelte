<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { setContext } from "svelte";
  import { slide } from "svelte/transition"

  export let elementRoot;
  export let tjs_doc;

  setContext("tjs_doc", tjs_doc);
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  {#if $tjs_doc.type === "hellpiercer"}
    <!-- TODO -->
  {:else if $tjs_doc.type === "demon"}
    <!-- TODO -->
  {/if}
</TJSApplicationShell>
