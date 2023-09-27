<script>
  /** @type {boolean} */
  export let tagEditor;
  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument}*/
  export let document;
  export let path = "system.tags";

  /** @type {HTMLDialogElement} */
  let dialog;

  $: tags = Array.from(foundry.utils.getProperty($document, path));
  $: if (dialog && tagEditor) dialog.show();
</script>

<dialog
  bind:this={dialog}
  on:close={() => {
    tagEditor = false;
    /** @type {string[]}*/
    const newtags = dialog.firstChild.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    $document.update({ [path]: newtags });
  }}
>
  <input type="text" value={tags.join(",")} />
  <button on:click|self={() => dialog.close()}>Save</button>
</dialog>

<style lang="scss">
  dialog {
    z-index: 1;
  }
</style>
