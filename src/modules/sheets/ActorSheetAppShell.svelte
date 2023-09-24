<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { getContext, setContext } from "svelte";
  import { slide } from "svelte/transition";
  import HumanSheet from "./HumanSheet.svelte";

  export let elementRoot;
  export let actor;

  const external = getContext("#external");
  console.log(external);

  $: external.application.reactive.title = $actor.name + ($actor.isToken ? " [Token]" : "");

  const sheets = {
    ["human"]: HumanSheet,
  };

  setContext("tjs_doc", actor);
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  <svelte:component this={sheets[$actor.type]} />
</TJSApplicationShell>
