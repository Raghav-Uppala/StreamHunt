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
    let data = [getTopRatedMovies(), getTopRatedShows()]
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
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        state["countryName"] = data.country_name;
        state["countryCode"] = data.country;
      });
    let carouselM = document.createElement("carousel-slider")
    carouselM.id = "topRatedMovies"

    let carouselS = document.createElement("carousel-slider")
    carouselS.id = "topRatedShows"

    this.#shadow.innerHTML = "<custom-header></custom-header>"
    this.#shadow.appendChild(carouselM)
    this.#shadow.appendChild(carouselS)

    Promise.resolve(data[0])
      .then((results) => {
        console.log(results)
        carouselM.data = results["results"]
      })

    Promise.resolve(data[1])
      .then((results) => {
        console.log(results)
        carouselS.data = results["results"]
      })

  }
}
customElements.define("home-page", HomePage);
