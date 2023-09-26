<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { localize } from "#runtime/svelte/helper";
  import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
  import { getContext } from "svelte";
  import { slide } from "svelte/transition";
  import HumanSheet from "./HumanSheet.svelte";

  export let elementRoot;

  const external = getContext("#external");
  let actor = new TJSDocument(external.application.actor);

  $: external.application.reactive.title =
    $actor.name + ($actor.isToken ? ` [${localize("Token")}]` : "");

  const sheets = {
    ["human"]: HumanSheet,
  };
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  <svelte:component this={sheets[$actor.type]} {actor} />
</TJSApplicationShell>
