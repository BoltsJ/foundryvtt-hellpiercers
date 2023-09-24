<script>
  export let tagEditor;
  export let document;

  /** @type {HTMLDialogElement} */
  let dialog;

  $: tags = Array.from($document.system.tags);
  $: if (dialog && tagEditor) dialog.show();
</script>

<dialog
  bind:this={dialog}
  on:close={() => {
    tagEditor = false;
    const newtags = dialog.firstChild.value
      .split(",")
      .map(t => t.trim())
      .filter(Boolean);
    $document.update({ "system.tags": newtags });
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
