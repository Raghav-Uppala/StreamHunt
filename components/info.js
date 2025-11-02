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

  yearFromDate(date) {
    return date.split('-')[0]
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

    let link = "https://image.tmdb.org/t/p/w1920"
    if (this.#data["backdrop_path"] != null) {
      link += this.#data["backdrop_path"]
    } else if (this.#data["poster_path"] != null){
      link += this.#data["poster_path"]
    }
    console.log(link)

    let height;
    try {
      height = document.querySelector("custom-header").shadowRoot.querySelector("#header").offsetHeight
    } catch (e) {
      height = "0"
    }

    background.style.height = "calc(100vh - " + height + "px)"

    let container = document.createElement("div")
    container.className = "infoBoxContainer"

    let title = document.createElement("h1")
    title.className = "title"
    if (this.#data["mediaType"] == "m") {
      title.textContent = this.#data["title"] 
      title.textContent +=  " (" + this.yearFromDate(this.#data["release_date"]) + ")"
    } else if (this.#data["mediaType"] == "s") {
      title.textContent = this.#data["name"] 
      let last;

      if (this.#data["in_production"] == false) {
        last = this.yearFromDate(this.#data["last_air_date"])
      } else {
        last = ""
      }

      title.textContent +=  " (" + this.yearFromDate(this.#data["first_air_date"]) + " - " + last + ")"
    }
    
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

    let cont = document.createElement("div")

    let overview = document.createElement("div")
    overview.className = "desc"
    overview.textContent = this.#data["overview"]


    let ratingbar = document.createElement("progress-bar")
    ratingbar.style.marginTop = "10px"

    let angle = 0
    let rating = this.#data["vote_average"]
    if (rating != null) {
      console.log(rating)
      angle = rating * 10
    }
    ratingbar.setAttribute("data-percent", angle)
    ratingbar.setAttribute("data-size", "80")
    ratingbar.setAttribute("data-line", "10")

    cont.appendChild(ratingbar)
    cont.appendChild(overview)
    cont.style.display = "flex"

    let seasonNum = ""
    if (this.#data["mediaType"] == "s") {
      seasonNum = "&s=1&e=1"
    }

    let watchNowCont = document.createElement("div")
    watchNowCont.className = "watchNowCont"

    
    let playTrailer = document.createElement("button")
    playTrailer.className = "watchNow"
    playTrailer.textContent = "Watch Trailer" 
    playTrailer.addEventListener("click", () => {
      window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
    })
    //watchNowCont.appendChild(playTrailer)

    let playVidlink = document.createElement("button")
    playVidlink.className = "watchNow"
    playVidlink.textContent = "Watch Now" 
    playVidlink.addEventListener("click", () => {
      window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
    })
    watchNowCont.appendChild(playVidlink)

    let similarCont = document.createElement("div")

    let similarHeading = document.createElement("h1")
    similarHeading.textContent = "Similar "
    similarHeading.className = "similarHeading"

    let similar = document.createElement("carousel-slider")

    if (this.#data["mediaType"] == "m") {
      similarHeading.textContent += "Movies"
      getSimilarMovies(this.#data["id"])
        .then(res => {
          similar.data = res["results"]
        })
    } else if (this.#data["mediaType"] == "s") {
      similarHeading.textContent += "Shows"
      getSimilarShows(this.#data["id"])
        .then(res => {
          similar.data = res["results"]
        })
    }

    similarCont.appendChild(similarHeading)
    similarCont.appendChild(similar)

    container.appendChild(title)
    container.appendChild(genres)
    container.appendChild(cont)
    container.appendChild(watchNowCont)

    background.appendChild(container)

    this.#shadow.innerHTML = `
      <style>
        .similarHeading {
          color:var(--text-900);
        }
        .desc {
          margin-left:20px;
        }
        .watchNowCont {
          width:100%;
          display:flex;
          margin-top:1vh;
          justify-content:center;
        }
        .watchNow {
          background-color:var(--primary-800);
          border-radius:30px;
          padding:5px;
          width:90px;
          font-weight:600;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border:red;
        }
        .watchNow:hover {
          background-color:var(--secondary-500);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(color-mix(var(--secondary-500)) 0.6);
        }
        
        .watchNow:active {
          transform: scale(0.98);
        }

        .genre {
          margin-right:1vw;
          background-color:var(--primary-200);
          border-radius:30px;
          margin-bottom:1vh;
          padding:5px 15px;
        }

        .infoBoxContainer {
          color:var(--text-900);
          padding:2vh;
          padding-top:20vh;
          width:40vw;
          margin-left:1vw;
        }

        @media only screen and (max-width: 1200px) { 
          .infoBoxContainer {
            color:var(--text-900);
            padding:2vh;
            padding-top:20vh;
            width:90vw;
            margin-left:1vw;
          }
        }

        .infoBackground {
          background-color:var(--background-50);
          background:linear-gradient(to right, color-mix(in srgb, var(--background-50) 100%, transparent), color-mix(in srgb, var(--background-50) 30%, transparent)), url(${link});
        }
      </style>
    `;
    this.#shadow.appendChild(background)
    this.#shadow.appendChild(similarCont)
  }
}
customElements.define("info-box", InfoBox);
