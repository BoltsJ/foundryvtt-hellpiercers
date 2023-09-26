import { getContext } from "svelte";

/**
 * Svelte action for syncing an Input with a Document
 * @type {import("svelte/action").Action<HTMLElement, import("#runtime/svelte/store/fvtt/document").TJSDocument>}
 */
export function updateDoc(node) {
  /** @type {foundry.abstract.Document} */
  const document = getContext("#external").application.document;
  if (!document)
    return console.error(
      "The updateDoc action must be used in a sheet context that provides a document parameter"
    );

  /** @param {Event} ev */
  function onChange(ev) {
    /** @type HTMLInputElement */
    const target = ev.target;
    if (!foundry.utils.hasProperty(document, target.name)) return;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const data_type = target.dataset.dtype;
    document.update({ [target.name]: data_type === "Number" ? parseFloat(value) : value });
  }

  function activateListeners() {
    node.addEventListener("change", onChange);
  }

  function deactivateListeners() {
    node.removeEventListener("change", onChange);
  }

  activateListeners();

  return {
    destroy() {
      deactivateListeners();
    },
  };
}
