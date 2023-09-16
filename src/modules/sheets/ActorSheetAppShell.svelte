<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { setContext } from "svelte";
  import { slide } from "svelte/transition";
  import HellpiercerSheet from "./HellpiercerSheet.svelte";

  const sheets = {
    ["hellpiercer"]: HellpiercerSheet,
  };
  export let elementRoot;
  export let actor;

  setContext("tjs_doc", actor);
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  <svelte:component this={sheets[$actor.type]} />
</TJSApplicationShell>
