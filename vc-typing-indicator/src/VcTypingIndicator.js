import { html, css, LitElement } from 'lit-element';

export class VcTypingIndicator extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-typing-indicator-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      conversation: { type: Object },
      typingStatus: { type: String }
    };
  }

  constructor() {
    super();
    this.conversation = {};
    this.typingStatus = "";
  }

  updated(changedProperties) {
    if(changedProperties.get("conversation")){
      this.conversation.on("text:typing:on",(data) => {
        if (data.user.id !== data.conversation.me.user.id) {
          this.typingStatus = `${data.display_name} is typing...`;
        }
      });
      this.conversation.on("text:typing:off", () => {
        this.typingStatus = "";
      });
    }
  }

  render() {
    return html`
      <p>${this.typingStatus}</p>
    `;
  }
}
