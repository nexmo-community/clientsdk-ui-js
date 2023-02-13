import { html, css, LitElement } from 'lit';

export class VcKeypad extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-keypad-text-color, #000);
      }

      #container {
        width: 75vw;
        max-width: 300px;
      }

      .button-row {
        display: flex;
        justify-content: space-evenly;
      }

      .full-width {
        width: 100%;
      }

      input {
        color: var(--vc-text-input-text-color, #000);
        padding: 5px 15px;
        background-color: transparent;
        border: 1px solid var(--vc-text-input-border-color, #000);
        border-radius: 6px;
        width: 100%;
        font-size: 1.4rem;
        box-sizing: border-box;
        margin: 5px;
      }

      button {
        color: var(--vc-button-text-color, #fff);
        padding: 5px 15px;
        background-color: transparent;
        border: 1px solid var(--vc-button-border-color, #000);
        border-radius: 6px;
        cursor: pointer;
        background: #871fff;
        font-size: 1.4rem;
        margin: 5px;
      }
    `;
  }

  static get properties() {
    return {
      noAsterisk: { attribute: 'no-asterisk', type: Boolean },
      noHash: { attribute: 'no-hash', type: Boolean },
      noDisplay: { attribute: 'no-display', type: Boolean },
      actionText: { type: String },
      cancelText: { type: String },
      actionStarted: { type: Boolean },
      digits: { type: String },
      currentPosition: { type: Number },
      keys: { type: Array },
      placeholder: { type: String },
    };
  }

  constructor() {
    super();
    this.noAsterisk = false;
    this.noHash = false;
    this.noDisplay = false;
    this.digits = "";
    this.actionText = "Enter";
    this.cancelText = "Cancel"
    this.actionStarted = false;
    this.currentPosition = 0;
    this.keys = ['1','2','3','4','5','6','7','8','9','*','0','#'];
    this.placeholder = "";
  }

  __addDigit(digit){
    const front = this.digits.substring(0, this.currentPosition);
    const end = this.digits.substring(this.currentPosition);
    this.digits = front + digit + end;
    const digitAdded = new CustomEvent('digit-added', {
      detail: { digit, position: this.currentPosition },
      bubbles: true,
      composed: true });
    this.dispatchEvent(digitAdded);
    this.currentPosition++;
  }

  __displayBlur(){
    if (!this.noDisplay){
      this.currentPosition = this.shadowRoot.getElementById('digits-display').selectionStart;
    }
  }

  __sendDigits(){
    const digitsSent = new CustomEvent('digits-sent', {
      detail: { digits: this.digits },
      bubbles: true,
      composed: true });
    this.dispatchEvent(digitsSent);
  }

  createAction(){
    this.actionStarted = true;
  }

  __endAction(){
    const actionEnded = new CustomEvent('action-ended', {
      detail: { },
      bubbles: true,
      composed: true });
    this.dispatchEvent(actionEnded);
    this.digits = "";
    this.actionStarted = false;
  }

  cancelAction(){
    this.digits = "";
    this.actionStarted = false;
  }

  setDigits(digitsSent){
    this.digits = digitsSent;
  }

  render() {
    return html`
      <div part="container" id="container">
        ${this.noDisplay ? "" : html`<input part="input" type="text" id="digits-display" label="" .placeholder=${this.placeholder} .value=${this.digits} @blur=${this.__displayBlur}>`}
        <div part="row position1" class="button-row">
          <button part="button position1" @click=${()=>this.__addDigit(this.keys[0])}>${this.keys[0]}</button>
          <button part="button position2" @click=${()=>this.__addDigit(this.keys[1])}>${this.keys[1]}</button>
          <button part="button position3" @click=${()=>this.__addDigit(this.keys[2])}>${this.keys[2]}</button>
        </div>
        <div part="row position2" class="button-row">
          <button part="button position4" @click=${()=>this.__addDigit(this.keys[3])}>${this.keys[3]}</button>
          <button part="button position5" @click=${()=>this.__addDigit(this.keys[4])}>${this.keys[4]}</button>
          <button part="button position6" @click=${()=>this.__addDigit(this.keys[5])}>${this.keys[5]}</button>
        </div>
        <div part="row position3" class="button-row">
          <button part="button position7" @click=${()=>this.__addDigit(this.keys[6])}>${this.keys[6]}</button>
          <button part="button position8" @click=${()=>this.__addDigit(this.keys[7])}>${this.keys[7]}</button>
          <button part="button position9" @click=${()=>this.__addDigit(this.keys[8])}>${this.keys[8]}</button>
        </div>
        <div part="row position4" class="button-row">
          ${this.noAsterisk ?
            ""
            : html`<button part="button position10" @click=${()=>this.__addDigit(this.keys[9])}>${this.keys[9]}</button>`
          }
          <button part="button position11" @click=${()=>this.__addDigit(this.keys[10])}>${this.keys[10]}</button>
          ${this.noHash ?
            ""
            :html`<button part="button position12" @click=${()=>this.__addDigit(this.keys[11])}>${this.keys[11]}</button>`
          }
        </div>
        <div part="row position5" class="button-row">
          ${this.actionStarted ?
            html`<button part="button cancel" fullwidth @click=${this.__endAction}>${this.cancelText}</button>`
            :html`<button part="button action" fullwidth @click=${this.__sendDigits}>${this.actionText}</button>`
          }
        </div>
      </div>
    `;
  }
}
