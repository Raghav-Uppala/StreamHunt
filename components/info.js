class InfoBox extends HTMLElement {
  #shadow;
  #data;
  #genres;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.#genres = [];
    this.render();
  }

  get data() {
    return this.#data;
  }

  get genres() {
    return this.#genres;
  }

  set genres(value) {
    this.#genres = structuredClone(value);
    this.render();
  }

  set data(value) {
    this.#data = structuredClone(value);
    this.render();
  }

  render() {
    let background = document.createElement("div")
    background.className = "infoBackground"
    //let cont = document.createElement("div")
    //background.style.background = "linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 1)), " + url
    //html.style.backgroundColor = "linear-gradient(to top, transparent, rgba(0, 0, 0, 0.5))"
    //html.style.backgroundBlendMode = "darken"
    background.style.backgroundPosition = "top right"
    background.style.backgroundRepeat = "no-repeat"

    let height;
    try {
      height = document.querySelector("custom-header").shadowRoot.querySelector("#header").offsetHeight
    } catch (e) {
      height = "0"
    }

    background.style.height = "calc(100vh - " + height + "px)"

    let container = document.createElement("div")
    container.className = "infoBoxContainer"
    container.style.color = "white"
    container.style.padding = "2vh"
    container.style.paddingTop = "20vh"
    container.style.width = "40vw"

    let title = document.createElement("h1")
    title.className = "title"
    title.textContent = this.#data["title"]

    let genres = document.createElement("div")
    genres.style.display = "flex"
    genres.className = "genres"
    if (this.#data["genres"] != undefined && this.#data["genres"] != null) {
      for (let i = 0; i < this.#data["genres"].length; i++) {
        let genre = this.#data["genres"][i]["name"]
        let genre_ul = document.createElement("div")
        genre_ul.textContent = genre
        genre_ul.className = "genre"
        genres.appendChild(genre_ul)
      }
    }

    let overview = document.createElement("div")
    overview.className = "desc"
    overview.textContent = this.#data["overview"]

    let playVidlink = document.createElement("a")
    playVidlink.textContent = "play" 
    playVidlink.href = "#watch?id="+this.#data["id"] + "&t=m"

    container.appendChild(title)
    container.appendChild(genres)
    container.appendChild(overview)
    container.appendChild(playVidlink)

    background.appendChild(container)

    this.#shadow.innerHTML = `
      <style>
        .genre {
          margin-right:1vw;
          padding:5px;
          background-color:var(--background-200);
          border-radius:30px;
        }
        .genres {
          padding-left:2vw; 
        }
        .infoBoxContainer {
          color:var(--text-900);
        }
        .infoBackground {
          background-color:var(--background-50);
          background:linear-gradient(to right, color-mix(in srgb, var(--background-50) 100%, transparent), color-mix(in srgb, var(--background-50) 30%, transparent)), url(https://image.tmdb.org/t/p/w1920${this.#data["backdrop_path"]});
        }
      </style>
    `;
    this.#shadow.appendChild(background)
  }
}
customElements.define("info-box", InfoBox);
