class HomePage extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.render();
  }

  render() {
    let header = document.createElement("custom-header")
    let carousel = document.createElement("carousel-slider")
    carousel.id = "topRatedMovies"

    this.#shadow.innerHTML = ""
    this.#shadow.appendChild(header)
    this.#shadow.appendChild(carousel)

    let topRated = getTopRated()
    let movieGenreIds = getMovieGenreIds()
    
    Promise.all([topRated, movieGenreIds])
      .then((results) => {
        renderToCarousel(results[0], results[1], { "elem" : carousel})
      })
  }
}
customElements.define("home-page", HomePage);
