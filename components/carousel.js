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

      //let popover = document.createElement("info-box")
      //popover.genres = this.#genres
      //popover.data = elem
      //popover.id = elem["id"] + "popover"
      //popover.popover = "auto"
      //popover.style.padding = 0
      //popover.style.border = "none"

      let img = document.createElement("img")
      img.src = 'https://image.tmdb.org/t/p/w342/' + elem["poster_path"]
      //img.setAttribute("popovertarget", elem["id"] + "popover")
      let id = elem["id"]

      img.addEventListener('click', () => {
        window.location.hash='info?id=' + id + '&t=m'
      })

      container.appendChild(img)
      //container.appendChild(popover)
      
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
