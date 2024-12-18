export class HellpiercersChatMessage extends ChatMessage {
  /** @param {HTMLElement} html */
  addListeners(html) {
    this.system.addListeners?.(html);
  }
}
