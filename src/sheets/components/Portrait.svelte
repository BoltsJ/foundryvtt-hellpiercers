<script>
  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument<Actor>}*/
  export let document;

  function pick() {
    new FilePicker({
      current: $document.img,
      type: "image",
      callback: path => $document.update({ img: path }),
    }).browse();
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<img
  class="portrait"
  src={$document?.img}
  title={$document?.name}
  width="100"
  height="100"
  alt="{$document?.name} portrait"
  on:click={pick}
/>

<style>
  img {
    object-fit: cover;
    object-position: 50% 0;
  }
</style>
