class SearchPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {"q" : ""}
    this.render();
  }

  get params() {
    return this.#params
  }

  set params(value) {
    this.#params = structuredClone(value)
    this.render()
  }

  render() {
    this.#shadow.innerHTML = `<custom-header></custom-header>`
    if (this.#params["q"] != "") {
      let resDataM = getMovieByName(this.#params["q"])
      resDataM.then(res => {
        let carousel = document.createElement("carousel-slider")
        carousel.data = res["results"]
        this.#shadow.appendChild(carousel)
      })
    }

  }
}
customElements.define("search-page", SearchPage);
