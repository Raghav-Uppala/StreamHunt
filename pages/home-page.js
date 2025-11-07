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
    HomePage.cachedData = JSON.parse(localStorage.getItem("homePageData"))
    if (HomePage.cachedData) {
      this.render(HomePage.cachedData);
    } else {
      this.fetchData();
    }
  }

  fetchData() {
    let data = [getTopRatedMovies(), getTopRatedShows(), getPopularMovies(), getPopularShows()]
    Promise.all(data)
      .then((res) => {
        HomePage.cachedData = res
        localStorage.setItem("homePageData", JSON.stringify(res));
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

    let carouselTM = document.createElement("carousel-slider")
    carouselTM.id = "topRatedMovies"
    let headingTM = document.createElement("h1")
    headingTM.textContent = "Top Rated Movies"

    let carouselTS = document.createElement("carousel-slider")
    carouselTS.id = "topRatedShows"
    let headingTS = document.createElement("h1")
    headingTS.textContent = "Top Rated Shows"

    let carouselPM = document.createElement("carousel-slider")
    carouselTS.id = "popularMovies"
    let headingPM = document.createElement("h1")
    headingPM.textContent = "Popular Movies"

    let carouselPS = document.createElement("carousel-slider")
    carouselPS.id = "popularShows"
    let headingPS = document.createElement("h1")
    headingPS.textContent = "Popular Shows"

    this.#shadow.innerHTML = `
      <custom-header></custom-header>
      <style>
        h1 {
          color:var(--text-950);
        }
      </style>
    `;

    this.#shadow.appendChild(headingPM)
    this.#shadow.appendChild(carouselPM)
    this.#shadow.appendChild(headingPS)
    this.#shadow.appendChild(carouselPS)
    this.#shadow.appendChild(headingTM)
    this.#shadow.appendChild(carouselTM)
    this.#shadow.appendChild(headingTS)
    this.#shadow.appendChild(carouselTS)

    Promise.resolve(data[0])
      .then((results) => {
        carouselTM.data = results["results"]
      })

    Promise.resolve(data[1])
      .then((results) => {
        carouselTS.data = results["results"]
      })

    Promise.resolve(data[2])
      .then((results) => {
        carouselPM.data = results["results"]
      })

    Promise.resolve(data[3])
      .then((results) => {
        carouselPS.data = results["results"]
      })
  }
}
customElements.define("home-page", HomePage);
