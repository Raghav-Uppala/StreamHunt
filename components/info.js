class InfoBox extends HTMLElement {
  #shadow;
  #data;
  #genres;

  constructor() {
    super(); this.#shadow = this.attachShadow({ mode: 'open' }); this.#data = []; this.#genres = [];
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
    background.style.backgroundPosition = "top right"
    background.style.backgroundRepeat = "no-repeat"

    let link = "https://image.tmdb.org/t/p/w1920"
    if (this.#data["backdrop_path"] != null) {
      link += this.#data["backdrop_path"]
    } else if (this.#data["poster_path"] != null){
      link += this.#data["poster_path"]
    }

    let height;
    try {
      height = document.querySelector("custom-header").shadowRoot.querySelector("#header").offsetHeight
    } catch (e) {
      height = "0"
    }

    //background.style.height = "calc(100vh - " + height + "px)"

    let container = document.createElement("div")
    container.className = "infoBoxContainer"

    let title = document.createElement("h1")
    title.id = "title"
    title.className = "title"
    if (this.#data["mediaType"] == "m") {
      title.textContent = this.#data["title"] 
    } else if (this.#data["mediaType"] == "s") {
      title.textContent = this.#data["name"] 
    }

    let titleImg = document.createElement("img")
    titleImg.id = "titleImg"
    titleImg.className = "titleImg"

    if (this.#data["mediaType"] == "m") {
      getMovieImages(this.#data["id"])
        .then(res => {
          if (res["logos"].length != 0) {
            titleImg.src = "https://image.tmdb.org/t/p/w300" + res["logos"][0]["file_path"]
            this.#shadow.querySelector("#title").replaceWith(titleImg)
          }
        })
    } else if (this.#data["mediaType"] == "s") {
      getShowImages(this.#data["id"])
        .then(res => {
          if (res["logos"].length != 0) {
            titleImg.src = "https://image.tmdb.org/t/p/w300" + res["logos"][0]["file_path"]
            this.#shadow.querySelector("#title").replaceWith(titleImg)
          }
        })
    }

    let year = ""
    if (this.#data["mediaType"] == "m") {
      year =  this.yearFromDate(this.#data["release_date"])
    } else if (this.#data["mediaType"] == "s") {
      let last = ""
      if (this.#data["in_production"] == false) {
        last = this.yearFromDate(this.#data["last_air_date"])
      } 

      year =  this.yearFromDate(this.#data["first_air_date"]) + " - " + last
      if (this.yearFromDate(this.#data["first_air_date"]) == last) {
        year =  this.yearFromDate(this.#data["first_air_date"])
      } 
    }


    let tagline = document.createElement("h4")
    tagline.className = "tagline"
    tagline.textContent = this.#data["tagline"]
    
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

    let yearDiv = document.createElement("div")
    yearDiv.textContent = year
    yearDiv.className = "genre"

    let rating = document.createElement("div")
    rating.textContent = Math.round(this.#data["vote_average"] *10)/10
    rating.className = "genre"

    let language = document.createElement("div")
    if (this.#data["original_language"] != undefined) {
      language.textContent = this.#data["original_language"].toUpperCase()
    }
    language.className = "genre"

    let contentRating = document.createElement("div")
    contentRating.textContent
    if(this.#data["mediaType"] == "m") {
      getMovieContentRating(this.#data["id"])
        .then(res => {
          let rating = res["results"].find(o => o["iso_3166_1"] == "US")["release_dates"]
          for (let i = 0; i < rating.length; i++) {
            if (rating[i]["certification"] != "") {
              contentRating.textContent = res["results"].find(o => o["iso_3166_1"] == "US")["release_dates"][i]["certification"];
            }
          }
        })
    } else if(this.#data["mediaType"] == "s") {
      getShowContentRating(this.#data["id"])
        .then(res => {
          contentRating.textContent = res["results"].find(o => o["iso_3166_1"] == "US")["rating"];
        })
    }
    contentRating.className = "genre"

    genres.appendChild(yearDiv)
    genres.appendChild(rating)

    if (this.#data["mediaType"] == "m") {
      let runtime = document.createElement("div")
      runtime.textContent = Math.floor(this.#data["runtime"] / 60) + "h " + this.#data["runtime"] % 60 + "m"
      runtime.className = "genre"
      genres.appendChild(runtime)
    }
    genres.appendChild(contentRating)
    genres.appendChild(language)

    let cont = document.createElement("div")
    let overview = document.createElement("div")
    overview.className = "desc"
    overview.textContent = this.#data["overview"]
    cont.appendChild(overview)
    cont.style.display = "flex"

    let seasonNum = ""
    if (this.#data["mediaType"] == "s") {
      seasonNum = "&s=1&e=1"
    }

    let watchNowCont = document.createElement("div")
    watchNowCont.className = "watchNowCont"

    
    //let playTrailer = document.createElement("button")
    //playTrailer.className = "watchNow"
    //playTrailer.textContent = "Watch Trailer" 
    //playTrailer.addEventListener("click", () => {
    //  window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
    //})
    //watchNowCont.appendChild(playTrailer)

    let playVidlink = document.createElement("button")
    playVidlink.className = "watchNow"
    playVidlink.textContent = "Watch Now" 
    playVidlink.addEventListener("click", () => {
      window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
    })
    watchNowCont.appendChild(playVidlink)
    //details.appendChild(watchNowCont)

    let backArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:30px;"><path fill="white" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`

    let backArrowCont = document.createElement("div")
    backArrowCont.innerHTML = backArrow
    backArrowCont.className = "backArrowCont"

    backArrowCont.addEventListener("click", () => {
      history.back()
    });



    container.appendChild(backArrowCont)
    container.appendChild(title)
    //container.appendChild(tagline)
    container.appendChild(genres)
    container.appendChild(cont)
    container.appendChild(watchNowCont)

    background.appendChild(container)

    this.#shadow.innerHTML = `
      <style>
        .backArrowCont {
          position:absolute;
          top:0;
          bottom:0;
          height:30px;
          width:30px;
          padding-right:30px;
          cursor:pointer;
          margin-top:3vh;
        }
        .backArrow {
          background:var(--light-background-50);
          height: 3px;
          width: 30px;
          position: relative;
          margin-top:3vh;
          margin-left:1vw;
          cursor: pointer;
          transform:rotate(180deg);
          &:before,
          &:after {
            content: "";
            background: var(--light-background-50);
            position: absolute;
            height: 3px;
            width: 15px;
          }
        
          &:before {
            right: -3px;
            bottom: -4px;
            transform: rotate(-45deg);
          }
        
          &:after {
            right: -3px;
            top: -4px;
            transform: rotate(45deg);
          }
        }

        .details {
          display:flex;
          gap:1rem;
        }
        .titleImg {
          width:500px;
          margin-bottom:4vh;
        }
        .tagline {
          font-style: italic;
        }
        .desc {
          width:40vw;
          margin-left:20px;
        }
        .watchNowCont {
          width:100%;
          display:flex;
          justify-content:left;
          margin-top:1vh;
        }
        .watchNow {
          background-color:var(--primary-800);
          border-radius:20px;
          padding:5px;
          margin-top:1vh;
          width:130px;
          height:40px;
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

        .genres {
          display:flex;
          gap:1vw;
        }
        .genre {
          background-color:var(--primary-200);
          border-radius:30px;
          margin-bottom:1vh;
          padding:5px 15px;
        }

        .infoBoxContainer {
          color:var(--text-900);
          padding:2vh;
          margin-left:1vw;
        }

        @media only screen and (max-width: 1200px) { 
          .infoBoxContainer {
            color:var(--text-900);
            padding:2vh;
            padding-top:20vh;
          }
          .desc {
            width:90vw;
          }
        }

        .infoBackground {
          background-color:var(--background-50);
          height:;
          background:
            linear-gradient(to right, var(--background-50), color-mix(in srgb, var(--background) 0%, transparent)),
            /*linear-gradient(to top, color-mix(in srgb, var(--background-50) 80%, transparent), color-mix(in srgb, var(--background-50) 0%, transparent)),*/
            url(${link});
          background-blend-mode: multiply;
          background-size: 100vw calc(100vw * (1045/1920));
          height:calc(100vw * (1045/1920));
          display:flex;
          flex-direction:column-reverse;
        }
        @import url('https://fonts.googleapis.com/css?family=Inter:700|Inter:400');
      </style>
    `;
    this.#shadow.appendChild(background)
  }
}
customElements.define("info-box", InfoBox);
