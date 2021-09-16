import { html, css, LitElement } from 'lit-element';

export class VcMembers extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-members-text-color, #000);
        font-size: 1.4rem;
      }
      ul {
        overflow: auto;
        list-style: none;
      }
      li {
        padding: 10px;
      }
      li:nth-child(odd) {
        background-color: var(--vc-members-nth-child-odd-color, #f9f9f9);
      }
      li:nth-child(even) {
        background-color: var(--vc-members-nth-child-even-color, #fcfcfc);
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
      <ul part="ul">
        ${this.members.map((member) => html`<li part="li">${member.displayName}</li>`)}
      </ul>
    `;
  }
}
