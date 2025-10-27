class CarouselSlider extends HTMLElement {
  #shadow;
  #data;
  #genres;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.#genres = []
    this.render();
  }

  get data() {
    return this.#data;
  }

  get genres() {
    return this.#genres;
  }
  
  set data(value) {
    this.#data = structuredClone(value);
    this.render();
  }

  set genres(value) {
    this.#genres = structuredClone(value);
    this.render();
  }

  updateDG(data, genres) {
    this.#data = structuredClone(data);
    this.#genres = structuredClone(genres);
    this.render();
  }

  render() {
    let elem = {}
    let html = document.createElement("div")
    for (let i = 0; i < this.#data.length; i++) {
      elem = this.#data[i]

      let container = document.createElement("div")
      container.class = elem["id"] 
      container.style.display = "flex"
      container.style.flex = "1"
      container.style.margin = "10px"
      container.style.justifyContent = "space-between"


      let img = document.createElement("img")
      img.src = 'https://image.tmdb.org/t/p/w342/' + elem["poster_path"]

      let subcontainer = document.createElement("div");
      subcontainer.class = elem["id"]+"Details"

      container.appendChild(img)
      container.appendChild(subcontainer)

      html.appendChild(container)
    }

    html.style.display = "flex"
    html.style.flexDirection = "row"
    html.style.gap = "1rem"

    this.#shadow.innerHTML = ""
    this.#shadow.appendChild(html)
  }
}
customElements.define("carousel-slider", CarouselSlider);
