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

  getHeading(text) {
    let headingPopular = document.createElement("div")
    headingPopular.className += "heading"

    let headingTextPopular = document.createElement("h1")
    headingTextPopular.textContent = text

    let popularSelector = document.createElement("div")
    popularSelector.className = "selector"

    let labelMPopular = document.createElement("label");
    let inputMPopular = document.createElement("input");
    inputMPopular.type = "radio";
    inputMPopular.name = text+"Selector";
    inputMPopular.value = "movies";

    inputMPopular.checked = true;
    labelMPopular.appendChild(inputMPopular);
    labelMPopular.append("Movies");

    let labelSPopular = document.createElement("label");
    let inputSPopular = document.createElement("input");
    inputSPopular.type = "radio";
    inputSPopular.name = text+"Selector";
    inputSPopular.value = "shows";

    labelSPopular.appendChild(inputSPopular);
    labelSPopular.append("Shows");

    popularSelector.appendChild(labelMPopular);
    popularSelector.appendChild(labelSPopular);

    headingPopular.appendChild(headingTextPopular)
    headingPopular.appendChild(popularSelector);

    return [headingPopular, [inputSPopular, inputMPopular]] 
  }

  render(data) {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        state["countryName"] = data.country_name;
        state["countryCode"] = data.country;
      });


    let carouselPopular = document.createElement("div")

    let [headingPopular, inputArrPopular] = this.getHeading("Popular")

    let popularMovies = document.createElement("carousel-slider")
    popularMovies.id = "popularMovies"
    let popularShows = document.createElement("carousel-slider")
    popularShows.id = "popularShows"

    carouselPopular.appendChild(headingPopular)
    carouselPopular.appendChild(popularMovies)

    inputArrPopular.forEach((elem) => elem.addEventListener("change", (e) => {
      if (e.target.value == "shows") {
        carouselPopular.removeChild(popularMovies)
        carouselPopular.appendChild(popularShows)
      } else if (e.target.value == "movies") {
        carouselPopular.removeChild(popularShows)
        carouselPopular.appendChild(popularMovies)
      }
    }))

    let carouselTopRated = document.createElement("div")

    let [headingTopRated, inputArrTopRated] = this.getHeading("Top Rated")

    let topRatedMovies = document.createElement("carousel-slider")
    topRatedMovies.id = "popularMovies"
    let topRatedShows = document.createElement("carousel-slider")
    topRatedShows.id = "popularShows"

    carouselTopRated.appendChild(headingTopRated)
    carouselTopRated.appendChild(topRatedMovies)

    inputArrTopRated.forEach((elem) => elem.addEventListener("change", (e) => {
      if (e.target.value == "shows") {
        carouselTopRated.removeChild(topRatedMovies)
        carouselTopRated.appendChild(topRatedShows)
      } else if (e.target.value == "movies") {
        carouselTopRated.removeChild(topRatedShows)
        carouselTopRated.appendChild(topRatedMovies)
      }
    }))

    let carouselTM = document.createElement("carousel-slider")
    carouselTM.id = "topRated"
    
    let headingTM = document.createElement("h1")
    headingTM.textContent = "Top Rated"

    //let carouselTS = document.createElement("carousel-slider")

    let container = document.createElement("div")
    container.className += "container"

    container.appendChild(document.createElement("custom-header"))
    container.appendChild(carouselPopular)
    container.appendChild(carouselTopRated)

    this.#shadow.innerHTML = `
      <style>
        .heading {
          display:flex;
        }
        .container {
          margin:0px 1dvw;
        }
        h1 {
          color:var(--text-950);
        }
        .selector {
          display:flex;
          align-items:center;
          margin-left:10px;
        }
        label { 
          display: flex;
          cursor: pointer;
          align-items:center;
          justify-content:center;
          margin-left:10px;
          color:var(--text-700);
          height:30px;
        }
        input[type=radio] {
          appearance: none;
          position:absolute;
          width:0px;
          height:0px;
        }
        label:has(input[type=radio]:checked) {
          color:var(--text-950);
          margin-bottom:-3px;
          border-bottom:solid red 3px;
        }
      </style>
    `;

    this.#shadow.appendChild(container)

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
