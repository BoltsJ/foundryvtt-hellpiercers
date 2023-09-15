import { getContext } from "svelte";

/**
 * Svelte action for syncing an Input with a Document
 * @type {import("svelte/action").Action<HTMLInputElement>}
 */
export function updateDoc(node) {
  /** @type {import("#runtime/svelte/store/fvtt/document").TJSDocument} */
  const tjs_doc = getContext("tjs_doc");
  let path = node.name;
  let current_value;
  let unsubscribe = tjs_doc.subscribe(onUpdate);

  /** @param {Event} ev */
  function onChange(ev) {
    const document = tjs_doc.get();
    if (!document) return;
    /** @type HTMLInputElement */
    const target = ev.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const data_type = target.dataset.dtype;
    document.update({ [path]: data_type === "Number" ? parseFloat(value) : value });
  }

  /** @param {globalThis.foundry.abstract.Document} document */
  function onUpdate(document) {
    const value = foundry.utils.getProperty(document, path);
    if (value === current_value) return;
    if (typeof value === "boolean") node.checked = value;
    else node.value = value;
    current_value = value;
  }

  function activateListeners() {
    node.addEventListener("change", onChange);
  }

  function deactivateListeners() {
    node.removeEventListener("change", onChange);
  }

  activateListeners();

  return {
    update() {
      if (unsubscribe) unsubscribe();
      tjs_doc = getContext("tjs_doc");
      unsubscribe = tjs_doc.subscribe(onUpdate);
    },
    destroy() {
      deactivateListeners();
      unsubscribe();
    },
  };
}
