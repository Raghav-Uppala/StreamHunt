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
    this.#shadow.innerHTML = `<custom-header></custom-header>
      <style>
        h1 {
          color:var(--text-950);
        }
      </style>
    `;
    if (this.#params["q"] != "") {

      let carouselM = document.createElement("carousel-slider")
      let headingM = document.createElement("h1")
      headingM.textContent = "Movies"

      let carouselS = document.createElement("carousel-slider")
      let headingS = document.createElement("h1")
      headingS.textContent = "Shows"

      let resDataM = getMovieByName(this.#params["q"])
      resDataM.then(res => {
        if (res["results"].length == 0) {
          this.#shadow.removeChild(headingM)
          this.#shadow.removeChild(carouselM)
        } else {
          carouselM.data = res["results"]
        }
      })
      let resDataS = getShowByName(this.#params["q"])
      resDataS.then(res => {
        if (res["results"].length == 0) {
          this.#shadow.removeChild(headingS)
          this.#shadow.removeChild(carouselS)
        } else {
          carouselS.data = res["results"]
        }
      })
      this.#shadow.appendChild(headingM)
      this.#shadow.appendChild(carouselM)
      this.#shadow.appendChild(headingS)
      this.#shadow.appendChild(carouselS)
    }

  }
}
customElements.define("search-page", SearchPage);
