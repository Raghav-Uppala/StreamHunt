class ViewCard extends HTMLElement {
  #shadow;
  #data;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#data = null;
  }

  connectedCallback() {
    const tpl = this.querySelector("template");

    if (tpl) {
      try {
        this.#data = JSON.parse(tpl.content.textContent.trim());
      }
      catch (ex) {
        console.error("Invalid JSON in <template>", ex);
        this.#data = null;
      }
    }
    else {
      this.#data = {"null": null}
    }

    this.render();
  }

  render() {
    this.#shadow.innerHTML = `
      <div>User data:</div>
      <ol>${this.#data.users.map(user => `<li>Id: ${user.id} - Name: ${user.name}</li>`).join('')}</ol>
      <div>Setting data:</div>
      <ol>${Object.entries(this.#data.settings).map(([key, value]) => `<li>${key}: ${value}</li>`).join('')}</ol>
    `;
  }
}
customElements.define("view-card", ViewCard);
