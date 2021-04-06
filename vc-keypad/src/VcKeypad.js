import { html, css, LitElement } from 'lit-element';
import '@material/mwc-button/mwc-button';
import '@material/mwc-textfield/mwc-textfield';

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

      mwc-button {
          margin: 10px;
      }

      mwc-textfield {
        --mdc-notched-outline-leading-width: 28px;
        --mdc-notched-outline-leading-border-radius: 28px 0 0 28px;
        --mdc-notched-outline-trailing-border-radius: 0 28px 28px 0;
        width: 100%;
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
        <div id="container">
            ${this.noDisplay ? "" : html`<mwc-textfield id="digits-display" outlined label="" .placeholder=${this.placeholder} .value=${this.digits} @blur=${this.__displayBlur}></mwc-textfield>`}
            <div class="button-row">
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[0])}>${this.keys[0]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[1])}>${this.keys[1]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[2])}>${this.keys[2]}</mwc-button>
            </div>
            <div class="button-row">
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[3])}>${this.keys[3]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[4])}>${this.keys[4]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[5])}>${this.keys[5]}</mwc-button>
            </div>
            <div class="button-row">
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[6])}>${this.keys[6]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[7])}>${this.keys[7]}</mwc-button>
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[8])}>${this.keys[8]}</mwc-button>
            </div>
            <div class="button-row">
                  ${this.noAsterisk ?
      ""
      : html`<mwc-button unelevated @click=${()=>this.__addDigit(this.keys[9])}>${this.keys[9]}</mwc-button>`
    }
                  <mwc-button unelevated @click=${()=>this.__addDigit(this.keys[10])}>${this.keys[10]}</mwc-button>
                  ${this.noHash ?
      ""
      :html`<mwc-button unelevated @click=${()=>this.__addDigit(this.keys[11])}>${this.keys[11]}</mwc-button>`
    }
            </div>
            <div class="button-row">
                ${this.actionStarted ?
      html`<mwc-button unelevated fullwidth @click=${this.__endAction}>${this.cancelText}</mwc-button>`
      :html`<mwc-button unelevated fullwidth @click=${this.__sendDigits}>${this.actionText}</mwc-button>`
    }
            </div>
        </div>
    `;
  }
}
