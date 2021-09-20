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
        color: var(--vc-text-input-text-color, #000);
        padding: 5px 15px;
        background-color: transparent;
        border: 1px solid var(--vc-text-input-border-color, #000);
        border-radius: 6px;
        width: 80%;
        font-size: 1.4rem;
      }
      button {
        color: var(--vc-text-input-text-color, #fff);
        padding: 5px 15px;
        background-color: transparent;
        border: 1px solid var(--vc-text-input-border-color, #000);
        border-radius: 6px;
        cursor: pointer;
        background: #871fff;
        font-size: 1.4rem;
      }
    `;
  }

  static get properties() {
    return {
      conversation: { type: Object },
      message: { type: String },
      placeholder: { type: String },
      buttonText: { type: String }
    };
  }

  constructor() {
    super();
    this.conversation = {};
    this.message = "";
    this.placeholder = "Enter message";
    this.buttonText = "send";
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
      <input part="input" placeholder=${this.placeholder} @keypress=${this.__handleKeypress} @keyup=${this.__handleKeyup} .value="${this.message}" type="text" id="text" name="text">
      <button part="button" @click=${this.__handleClickEvent}>${this.buttonText}</button>
    `;
  }
}
