class InfoPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {"id": null}
    this.render();
  }

  set params(value) {
    this.#params = value;
    this.render()
  }

  get params() {
    return this.#params;
  }

  render() {
    window.scrollTo(0, 0);
    let info = document.createElement("info-box")
    let watchProviders = document.createElement("watch-providers")
    let creditsCont = document.createElement("div")
    let similarCont = document.createElement("div")

    if (this.#params["id"] != null) {
      let infoData;
      if (this.#params["t"] == "m") {
        infoData = getMovieById(this.#params["id"])
      } else if (this.#params["t"] == "s") {
        infoData = getShowById(this.#params["id"])
      }
  
      infoData.then((res) => {
        res["mediaType"] = this.#params["t"]
        info.data = res
      })

      watchProviders.data = [state.countryCode, this.#params["id"], this.#params["t"]]


      let similarHeading = document.createElement("h1")
      similarHeading.textContent = "Similar "
      similarHeading.className = "similarHeading"

      let similar = document.createElement("carousel-slider")

      similarCont.appendChild(similarHeading)
      similarCont.appendChild(similar)

      if (this.#params["t"] == "m") {
        similarHeading.textContent += "Movies"
        getSimilarMovies(this.#params["id"])
          .then(res => {
            similar.data = res["results"]
          })
      } else if (this.#params["t"] == "s") {
        similarHeading.textContent += "Shows"
        getSimilarShows(this.#params["id"])
          .then(res => {
            similar.data = res["results"]
          })
      }

      let creditsHeading = document.createElement("h1") 
      creditsHeading.textContent = "Credits"

      let credits = document.createElement("credits-list")
      if (this.#params["t"] == "m") {
        getMovieCredits(this.#params["id"])
          .then(res => {
            let modData = res
            modData["mediaType"] = "m"
            credits.data = res
          })
      } else if (this.#params["t"] == "s") {
        getShowCredits(this.#params["id"])
          .then(res => {
            let modData = res
            modData["mediaType"] = "s"
            credits.data = res
          })
      }
      creditsCont.appendChild(creditsHeading)
      creditsCont.appendChild(credits)
    }


    this.#shadow.innerHTML = `
      <style>
        body {
          background-color:var(--background-50);
        }
        .similarHeading {
          color:var(--text-900);
        }
      </style>
    `;
    this.#shadow.appendChild(info)
    this.#shadow.appendChild(creditsCont)
    this.#shadow.appendChild(watchProviders)
    this.#shadow.appendChild(similarCont)
  }
}
customElements.define("info-page", InfoPage);
