class SearchPage extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    this.#shadow.innerHTML = `
      hello search
    `
  }
}
customElements.define("search-page", SearchPage);
