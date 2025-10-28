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
    let url = 'url(https://image.tmdb.org/t/p/w1280/' + this.#data["backdrop_path"] + ")"
    let html = document.createElement("div")
    html.style.backgroundImage = "linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent), "+ url
    html.style.backgroundRepeat = "no-repeat"
    html.style.width = "60vw"
    html.style.height = "60vh"

    let container = document.createElement("div")
    container.style.color = "white"
    container.style.padding = "2vh"
    container.style.paddingTop = "30vh"

    let title = document.createElement("h1")
    title.class = "title"
    title.textContent = this.#data["title"]

    let genres = document.createElement("div")
    genres.class = "genres"
    if (this.#data["genre_ids"] != null) {
      for (let i = 0; i < this.#data["genre_ids"].length; i++) {
        let genre = this.#genres.find(obj => obj.id == this.#data["genre_ids"][i]);
        let genre_ul = document.createElement("ul")
        genre_ul.textContent = genre["name"]
        genre_ul.class = "genre"
        //if (i != this.#data["genre_ids"].length - 1) {
        //  genre_ul.textContent += " • "
        //}
        genres.appendChild(genre_ul)
      }
    }

    let overview = document.createElement("div")
    overview.class = "desc"
    overview.textContent = this.#data["overview"]

    container.appendChild(title)
    container.appendChild(genres)
    container.appendChild(overview)

    html.appendChild(container)

    this.#shadow.innerHTML = ""
    this.#shadow.appendChild(html)
  }
}
customElements.define("info-box", InfoBox);
