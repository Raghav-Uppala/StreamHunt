class CustomHeader extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.#shadow.innerHTML = `
      <div>hello</div>
    `;
  }
}
customElements.define("custom-header", CustomHeader);
