import { html, css, LitElement } from 'lit-element';

export class VcMembers extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-members-text-color, #000);
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

  async updated(changedProperties) {
    if(changedProperties.get("conversation")){
      try {
        await this.conversation.getMembers({order:"asc", page_size:100}).then((members_page) => {
          members_page.items.forEach((member, key, map) => {
            if (member.state === "JOINED") {
              this.members = [...this.members, { displayName: member.display_name, memberId: member.id, userName: member.user.name, userId: member.user.id}];
            }
          })
        }).catch((error) => {
          console.error("error getting the members ", error);
        });
      }
      catch (error){
        console.error('error in getting members of the conversation: ', error);
      }
      this.conversation.on("member:joined",(member, event) => {
        this.members = [...this.members, member];
      });
      this.conversation.on("member:left", (memberLeft, event) => {
        this.members = this.members.filter(member => member.memberId !== memberLeft.memberId);
      });
    }
  }

  render() {
    return html`
      <ul>
        ${this.members.map((member) => html`<li>${member.displayName}</li>`)}
      </ul>
    `;
  }
}
