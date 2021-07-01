import { html, css, LitElement } from 'lit-element';

export class VcMessages extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-messages-text-color, #000);
      }
      #messages-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
      .message {
        border: 1px solid black;
        padding: 5px;
        border-radius: 9px;
        margin: 5px;
      }
      .my-message {
        text-align: right;
      }
    `;
  }

  static get properties() {
    return {
      conversation: { type: Object },
      messages: { type: Array },
    };
  }

  constructor() {
    super();
    this.conversation = {};
    this.messages = [];
    this.myId = '';
    this.messageFeed = {};
    this.feedAtBottom = false;
  }

  isFeedAtBottom() {
    return (
      this.messageFeed.offsetHeight + this.messageFeed.scrollTop ===
      this.messageFeed.scrollHeight
    );
  }

  scrollFeedToBottom() {
    this.messageFeed.scrollTop = this.messageFeed.scrollHeight;
  }

  updated(changedProperties) {
    this.messageFeed = this.shadowRoot.querySelector('#messages-container');
    if (changedProperties.get('conversation')) {
      this.myId = this.conversation.me.id;
      this.conversation.on('text', (sender, message) => {
        this.messages = [...this.messages, { sender, message }];
        this.feedAtBottom = this.isFeedAtBottom();
      });
    }
    if (this.feedAtBottom) {
      const messageElems = this.shadowRoot.querySelectorAll('.message');
      messageElems[this.messages.length - 1].scrollIntoView();
    }
  }

  render() {
    return html`
      <div id="messages-container">
        ${this.messages.map(
          message => html`
            ${this.myId === message.message.from
              ? html`<div class="message my-message">
                  ${message.message.body.text.replace(/</g, '&lt;')}<br /><small
                    >${message.sender.displayName.replace(/</g, '&lt;')}</small
                  >
                </div>`
              : html`<div class="message">
                  ${message.message.body.text.replace(/</g, '&lt;')}<br /><small
                    >${message.sender.displayName.replace(/</g, '&lt;')}</small
                  >
                </div>`}
          `
        )}
      </div>
    `;
  }
}
