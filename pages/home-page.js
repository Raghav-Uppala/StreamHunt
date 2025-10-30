class HomePage extends HTMLElement {
  #shadow;
  static cachedData = null;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {}
  }
  connectedCallback() {
    if (HomePage.cachedData) {
      this.render(HomePage.cachedData);
    } else {
      this.fetchData();
    }
  }

  fetchData() {
    let data = [getTopRated(), getMovieGenreIds()]
    Promise.all(data)
      .then((res) => {
        HomePage.cachedData = res
      })
    this.render(data)
  }

  set params(value) {
    this.#params = value;
    this.render()
  }

  get params() {
    return this.#params;
  }

  render(data) {
    let carousel = document.createElement("carousel-slider")
    carousel.id = "topRatedMovies"

    this.#shadow.innerHTML = "<custom-header></custom-header>"
    this.#shadow.appendChild(carousel)

    
    Promise.all([data[0],data[1]])
      .then((results) => {
        renderToCarousel(results[0], results[1], { "elem" : carousel})
      })
  }
}
customElements.define("home-page", HomePage);
