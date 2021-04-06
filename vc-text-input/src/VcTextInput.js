import { html, css, LitElement } from 'lit-element';

export class VcTextInput extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-text-input-text-color, #000);
      }
      input {
        width: 80%;
      }
    `;
  }

  static get properties() {
    return {
      conversation: { type: Object },
      message: { type: String }
    };
  }

  constructor() {
    super();
    this.conversation = {};
    this.message = "";
  }

  __handleKeypress(e) {
    this.conversation.startTyping();
  }

  __handleKeyup(e) {
    this.message = e.target.value;
    let timeout = null;
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      this.conversation.stopTyping();
    }, 500);
  }

  async __handleClickEvent() {
    if (this.message){
      await this.conversation.sendText(this.message);
      this.message = '';
    }
  }

  render() {
    return html`
      <input @keypress=${this.__handleKeypress} @keyup=${this.__handleKeyup} .value="${this.message}" type="text" id="text" name="text">
      <button @click=${this.__handleClickEvent}>send</button>
    `;
  }
}
