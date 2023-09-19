import { getContext } from "svelte";

/**
 * Svelte action for syncing an Input with a Document
 * @type {import("svelte/action").Action<HTMLFormElement, import("#runtime/svelte/store/fvtt/document").TJSDocument>}
 */
export function updateDoc(node, document) {
  /** @type {Map<string, { element: HTMLInputElement}>} */
  let inputs = new Map(
    Array.from(node.elements)
      .filter(e => !!e.name)
      .map(e => [e.name, { element: e, current: undefined }])
  );
  let unsubscribe = document.subscribe(onUpdate);


  /** @param {Event} ev */
  function onChange(ev) {
    const doc = document.get();
    if (!doc) return;
    /** @type HTMLInputElement */
    const target = ev.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const data_type = target.dataset.dtype;
    doc.update({ [target.name]: data_type === "Number" ? parseFloat(value) : value });
  }

  /** @param {globalThis.foundry.abstract.Document} doc */
  function onUpdate(doc) {
    Array.from(inputs.keys()).forEach(k => {
      const new_val = foundry.utils.getProperty(doc, k);
      if (new_val === inputs.get(k).current) return;
      const input = inputs.get(k).element;
      if (typeof new_val === "boolean") input.checked = new_val;
      else input.value = new_val;
    });
  }

  function activateListeners() {
    node.addEventListener("change", onChange);
  }

  function deactivateListeners() {
    node.removeEventListener("change", onChange);
  }

  activateListeners();

  return {
    update(new_doc) {
      if (unsubscribe) unsubscribe();
      inputs = new Map(
        Array.from(node.elements)
          .filter(e => !!e.name)
          .map(e => [e.name, { element: e, current: undefined }])
      );
      document = new_doc;
      unsubscribe = document.subscribe(onUpdate);
    },
    destroy() {
      deactivateListeners();
      if (unsubscribe) unsubscribe();
    },
  };
}
