<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { setContext } from "svelte";
  import { slide } from "svelte/transition";
  import HellpiercerSheet from "./HellpiercerSheet.svelte";

  export let elementRoot;
  export let actor;

  setContext("tjs_doc", actor);
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  {#if $actor.type == "hellpiercer"}
    <HellpiercerSheet />
  {:else if $actor.type == "demon"}
    <!-- TODO -->
  {/if}
</TJSApplicationShell>
