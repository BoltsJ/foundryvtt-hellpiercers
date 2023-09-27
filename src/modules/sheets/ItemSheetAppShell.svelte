<svelte:options accessors={true} />

<script>
  import { TJSApplicationShell } from "#runtime/svelte/component/core";
  import { localize } from "#runtime/svelte/helper";
  import { TJSDocument } from "@typhonjs-fvtt/runtime/svelte/store/fvtt/document";
  import { getContext } from "svelte";
  import { slide } from "svelte/transition";
  import ClassSheet from "./ClassSheet.svelte";

  export let elementRoot;

  const external = getContext("#external");
  let item = new TJSDocument(external.application.item);

  $: external.application.reactive.title =
    $item.name + ($item.isToken ? ` [${localize("Token")}]` : "");

  const sheets = {
    ["class"]: ClassSheet,
  };
</script>

<TJSApplicationShell bind:elementRoot transition={slide} transitionOptions={{ duration: 100 }}>
  <svelte:component this={sheets[$item.type]} {item} />
</TJSApplicationShell>
