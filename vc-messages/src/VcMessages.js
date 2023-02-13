import { html, css, LitElement } from 'lit';

export class VcMessages extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-messages-text-color, #000);
        font-size: 1.4rem;
      }
      #messages-container {
        width: 100%;
        height: 100%;
        overflow-y: auto;
      }
      .message {
        padding: 15px;
        margin: 5px;
      }
      .message-text {
        border-radius: 6px;
        background-color: #f0f0f0;
        display: inline-block;
        padding: 2px 8px;
        border-radius: 6px 6px 6px 0;
      }
      .message.mine {
        text-align: right;
      }
      .message-text.mine {
        background-color: #e0e0ff;
        border-radius: 6px 6px 0px 6px;
      }
      .username {
        font-size: 1.2rem;
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
      this.conversation.on('message', (sender, message) => {
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
              ? html`<div class="message mine" part="message mine">
                <div class="message-text mine" part="message-text mine">${message.message.body.text.replace(/</g, '&lt;')}</div>
                <div class="username mine" part="username mine">${message.sender.displayName.replace(/</g, '&lt;')}</div>
              </div>`
              : html`<div class="message" part="message">
                  <div class="message-text" part="message-text">${message.message.body.text.replace(/</g, '&lt;')}</div>
                  <div class="username" part="username">${message.sender.displayName.replace(/</g, '&lt;')}</div>
                </div>`}
          `
        )}
      </div>
    `;
  }
}
