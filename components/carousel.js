class CarouselSlider extends HTMLElement {
  #shadow;
  #data;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = structuredClone(value);
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
      container.className = "carouselItem"

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
      container.setAttribute("tabindex", "0")
      
      html.appendChild(container)
    }

    let leftButton = document.createElement("div")
    leftButton.className = "leftButton"
    
    let leftArrow = document.createElement("div")
    leftArrow.className = "leftArrow"
    leftButton.appendChild(leftArrow)
    leftArrow.addEventListener("click", () => {
      html.scrollBy({ left: -window.innerWidth * 0.8, top: 0, behavior: 'smooth' })
    })

    let rightButton = document.createElement("div")
    rightButton.className = "rightButton"

    let rightArrow = document.createElement("div")
    rightArrow.className = "rightArrow"
    rightButton.appendChild(rightArrow)
    rightArrow.addEventListener("click", () => {
      html.scrollBy({ left: window.innerWidth * 0.8, top: 0, behavior: 'smooth' })
    })
    
    let finalCont = document.createElement("div")
    finalCont.className = "carouselCont"

    this.#shadow.innerHTML = `
      <style>
        .leftButton, .rightButton {
          width:300px;
          height:calc(185px*1.5);
          position:absolute;
          pointer-events: none;
          align-content: center;
          z-index:99999;
        }
        .leftButton {
          left:0;
        }
        .rightButton {
          right:0;
        }

        .leftArrow, .rightArrow {
          border: solid var(--secondary-500);
          width:50px;
          height:50px;
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
          position:relative;
          cursor:pointer;
          display:flex;
        }
        .carouselCont img {
          width:185px;
          height:calc(185px*1.5);
          opacity:1;
          trasition:opacity 0.3s ease;
        }

        .carouselCont img:hover {
          opacity:0.5;
        }

        .carousel {
          wdith:100dvw;
          display:flex;
          flex-direction:row;
          gap:1rem;
          width:100dwv;
          overflow-x:scroll;
          scrollbar-width: none;
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
