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

    let html = document.createElement("div")
    html.className = "carousel"


    let elem = {}
    for (let i = 0; i < this.#data.length; i++) {
      elem = this.#data[i]

      let type = "m"
      if (elem.hasOwnProperty("first_air_date")) {
        type = "s"
      }

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
      if (elem["poster_path"] == null) {
        img.src = "https://placehold.co/342x513/60656b/FFF?text=No+Poster"
      }
      //img.setAttribute("popovertarget", elem["id"] + "popover")
      let id = elem["id"]

      img.addEventListener('click', () => {
        window.location.hash='info?id=' + id + '&t=' + type
      })

      container.appendChild(img)
      //container.appendChild(popover)
      
      html.appendChild(container)
    }

    let leftButton = document.createElement("div")
    leftButton.className = "leftButton"
    
    let leftArrow = document.createElement("div")
    leftArrow.className = "leftArrow"
    leftButton.appendChild(leftArrow)
    leftArrow.addEventListener("click", () => {
      html.scrollBy({ left: -window.innerWidth, top: 0, behavior: 'smooth' })
    })

    let rightButton = document.createElement("div")
    rightButton.className = "rightButton"

    let rightArrow = document.createElement("div")
    rightArrow.className = "rightArrow"
    rightButton.appendChild(rightArrow)
    rightArrow.addEventListener("click", () => {
      html.scrollBy({ left: window.innerWidth, top: 0, behavior: 'smooth' })
    })
    
    let finalCont = document.createElement("div")
    finalCont.className = "carouselCont"

    this.#shadow.innerHTML = `
      <style>
        .leftButton, .rightButton {
          width:300px;
          height:513px;
          position:absolute;
          pointer-events: none;
        }
        .leftButton {
          background:linear-gradient(to right, color-mix(in srgb, var(--background-50) 100%, transparent), color-mix(in srgb, var(--background-50) 00%, transparent));
        }
        .rightButton {
          margin-left:calc(100vw - 300px);
          background:linear-gradient(to left, color-mix(in srgb, var(--background-50) 100%, transparent), color-mix(in srgb, var(--background-50) 00%, transparent));
        }

        .leftArrow, .rightArrow {
          border: solid var(--secondary-500);
          width:50px;
          height:50px;
          display: inline-block;
          margin-top:185px;
          cursor: pointer;
          pointer-events: auto;
        }
        .leftArrow {
          border-width: 0 10px 10px 0;
          margin-left:20px;
          transform: rotate(135deg);
          -webkit-transform: rotate(135deg);
        }
        .rightArrow {
          border-width: 10px 10px 0 0;
          margin-left:220px;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }
        .carouselCont {
          display:flex;
        }
        .carousel {
          display:flex;
          flex-direction:row;
          gap:1rem;
          width:100vw;
          overflow-x:scroll;
          scrollbar-width: none
        }
      </style>
    `;

    finalCont.appendChild(leftButton)
    finalCont.appendChild(html)
    finalCont.appendChild(rightButton)

    this.#shadow.appendChild(finalCont)
  }
}
customElements.define("carousel-slider", CarouselSlider);
