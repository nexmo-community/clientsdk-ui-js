import { html, css, LitElement } from 'lit-element';

export class VonageMembers extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vonage-members-text-color, #000);
      }
      ul {
        width: 100%;
        height: 100%;
        overflow: auto;
        list-style: none;
      }
    `;
  }

  static get properties() {
    return {
      conversation: { type: Object },
      members: { type: Array }
    };
  }

  constructor() {
    super();
    this.conversation = {};
    this.members = [];
  }

  updated(changedProperties) {
    if(changedProperties.get("conversation")){
      this.conversation.members.forEach((member, key, map) => {
        this.members = [...this.members, {id:member.id, display_name:member.display_name, name:member.user.name}];
      });
      this.conversation.on("member:joined",(member, event) => {
        this.members = [...this.members, {id:member.id, display_name:member.display_name, name:member.user.name}];
      });
      this.conversation.on("member:left", (memberLeft, event) => {
        this.members = this.members.filter(member => member.id !== memberLeft.id);
      });
    }
  }

  render() {
    return html`
      <ul>
        ${this.members.map((member) => html`<li>${member.display_name}</li>`)}
      </ul>
    `;
  }
}
