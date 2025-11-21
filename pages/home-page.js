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


    let carouselPopular = document.createElement("div")

    let headingPopular = document.createElement("h1")
    headingPopular.textContent = "Popular"

    let popularMovies = document.createElement("carousel-slider")
    popularMovies.id = "popularMovies"
    let popularShows = document.createElement("carousel-slider")
    popularShows.id = "popularShows"

    carouselPopular.appendChild(headingPopular)
    carouselPopular.appendChild(popularMovies)
    carouselPopular.appendChild(popularShows)

    let carouselTopRated = document.createElement("div")

    let headingTopRated = document.createElement("h1")
    headingTopRated.textContent = "Top Rated"

    let topRatedMovies = document.createElement("carousel-slider")
    topRatedMovies.id = "popularMovies"
    let topRatedShows = document.createElement("carousel-slider")
    topRatedShows.id = "popularShows"

    carouselTopRated.appendChild(headingTopRated)
    carouselTopRated.appendChild(topRatedMovies)
    carouselTopRated.appendChild(topRatedShows)

    let carouselTM = document.createElement("carousel-slider")
    carouselTM.id = "topRated"
    
    let headingTM = document.createElement("h1")
    headingTM.textContent = "Top Rated"

    let carouselTS = document.createElement("carousel-slider")

    this.#shadow.innerHTML = `
      <custom-header></custom-header>
      <style>
        h1 {
          color:var(--text-950);
        }
        label { 
          display: flex;
          cursor: pointer;
          align-items:center;
          justify-content:center;
          padding:0 10px;
          border-radius:50px;
          color:red;
        }
        input[type=radio] {
          appearance: none;
          position:absolute;
          width:0px;
          height:0px;
        }
        label:has(input[type=radio]:checked) {
          background-color:var(--background-200);
        }
      </style>
    `;

    this.#shadow.appendChild(carouselPopular)
    this.#shadow.appendChild(carouselTopRated)

    Promise.resolve(data[0])
      .then((results) => {
        topRatedMovies.data = results["results"]
      })

    Promise.resolve(data[1])
      .then((results) => {
        topRatedShows.data = results["results"]
      })

    Promise.resolve(data[2])
      .then((results) => {
        popularMovies.data = results["results"]
      })

    Promise.resolve(data[3])
      .then((results) => {
        popularShows.data = results["results"]
      })
  }
}
customElements.define("home-page", HomePage);
