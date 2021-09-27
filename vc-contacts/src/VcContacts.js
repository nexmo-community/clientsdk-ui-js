import { html, css, LitElement } from 'lit-element';

export class VcContacts extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--vc-contacts-text-color, #000);
      }
    `;
  }

  static get properties() {
    return {
      title: { type: String },
      counter: { type: Number },
      contacts: { type: Array },
      editIndex: { type: Number },
      contactPickerSupported: { type: Boolean }
    };
  }

  constructor() {
    super();
    this.contacts = [];
    this.editIndex = null;
    if(localStorage.getItem('contacts')) {
      this.__loadContacts();
    } else {
      console.log('no contacts in localStorage');
    }
    // see if Contact Picker API is supported
    this.contactPickerSupported = ('contacts' in navigator && 'ContactsManager' in window);
  }

  __loadContacts() {
    // load contacts from local storage
    this.contacts = JSON.parse(localStorage.getItem('contacts'));
    // custom event to send contacts to outer application
    const contactsLoaded = new CustomEvent('contacts-loaded', {
      detail: { contacts: this.contacts },
      bubbles: true,
      composed: true });
    this.dispatchEvent(contactsLoaded);

  }

  saveContact(contact) {
    // add the new contact to this.contacts Array
    this.contacts = [ ...this.contacts, {...contact, timestamp:Date.now()} ];
    this.__saveContacts();
  }

  __contactSelected(contact){
    const contactSelected = new CustomEvent('contact-selected', {
      detail: { contact },
      bubbles: true,
      composed: true
    });
    this.dispatchEvent(contactSelected);
  }

  __editContact(index){
    this.editIndex = index;
  }

  __saveEdit(index,editedContact){
    this.contacts[index] = editedContact;
    this.__saveContacts();
  }

  __deleteContact(deletedContact){
    this.contacts = this.contacts.filter(contact => contact.timestamp !== deletedContact.timestamp);
    this.__saveContacts();
  }

  __saveContacts(){
    this.editIndex = null;
    // save contact to local Storage
    localStorage.setItem('contacts', JSON.stringify(this.contacts));
    // load updated Contacts
    this.__loadContacts();
  }

  async __loadContactsFromDevice(){
    const props = ['name','tel'];
    const opts = { multiple: true };
    let newContacts = [];
    try {
      const deviceContacts = await navigator.contacts.select(props, opts);
      deviceContacts.forEach((contact,index) => {
        newContacts = [...newContacts,{name:contact.name[0], phone:contact.tel[0], timestamp:Date.now()+index}]
      });
      this.contacts = [...this.contacts,...newContacts];
      this.__saveContacts();
    } catch(error) {
      console.log('error getting contacts from device: ',error);
    }

  }

  render() {
    return html`
      ${this.contactPickerSupported? html`<button @click=${() => this.__loadContactsFromDevice()}>load contacts from device</button><br/>`:html``}
      ${this.contacts.length === 0 ?
      html`No contacts`:
      html`
         <ul>
            ${this.contacts.map((contact, index) => html`
              <li>
                ${this.editIndex === index?
                html`
                  <input type="text" .value="${contact.name}" @input=${(e) => {contact.name = e.target.value}} />
                  <br/><input type="tel" .value="${contact.phone}" @input=${(e) => {contact.phone = e.target.value}} />
                  <button @click=${() => this.__saveEdit(index,contact)}>save</button>
                `:
                html`
                  <span>${contact.name}</span>
                  <br/><span>${contact.phone}</span>
                  <button @click=${() => this.__editContact(index)}>edit</button>
                `}
                <button @click=${() => this.__deleteContact(contact)}>delete</button>
                <button @click=${() => this.__contactSelected(contact)}>select</button>
              </li>
            `)}
         </ul>
      `
    }
    `;
  }
}
