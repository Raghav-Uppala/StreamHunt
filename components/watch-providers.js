class WatchProviders extends HTMLElement {
  #shadow;
  #data

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = ["us", undefined, undefined]
    this.render()
  }

  connectedCallback() {
    this.render()
  }


  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = structuredClone(value);
    this.render();
  }

  perProviderType(data, type, el, name) {
    if(data[type] != undefined) {
      let elemCont = document.createElement("div")
      let elemTitle = document.createElement("h3")
      let providerCont = document.createElement("div")
      providerCont.className = "providerCont"
      elemCont.appendChild(elemTitle)
      elemCont.appendChild(providerCont)
      elemTitle.textContent = name
      for (let i = 0; i < data[type].length; i++) {
        let thisData = data[type][i]
        let elem = document.createElement("img")
        elem.className = "provider"
        elem.src = "https://image.tmdb.org/t/p/w45/" + thisData["logo_path"]
        elem.title += thisData["provider_name"]
        providerCont.appendChild(elem)
      }
      el.appendChild(elemCont)
    }
  }

  updateWatchProviders(data, el) {
    let providers = data["results"][this.#data[0].toUpperCase()]
    this.perProviderType(providers, "flatrate", el, "Stream")
    this.perProviderType(providers, "free", el, "Free")
    this.perProviderType(providers, "buy", el, "Buy")
    this.perProviderType(providers, "rent", el, "Rent")
  }

  render() {
    let providers = document.createElement("div")

    if (this.#data[1] != undefined && this.#data[2] != undefined) {
      if (this.#data[2] == "m") {
        getMovieWatchProviders(this.#data[1])
          .then(res => {
            this.updateWatchProviders(res, providers)
          })
      } else if (this.#data[2] == "s") {
        getShowWatchProviders(this.#data[1])
          .then(res => {
            this.updateWatchProviders(res, providers)
          })
      }
    }

    this.#shadow.innerHTML = `
    <style>
    div {
      color:white;
    }
    .provider {
      width:45px;
      height:45px;
    } 
    .providerCont {
      display:flex;
      gap:1rem;
    }
    </style>
    `;
    this.#shadow.appendChild(providers)
  }
}
customElements.define("watch-providers", WatchProviders);
