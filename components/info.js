class InfoBox extends HTMLElement {
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

  yearFromDate(date) {
    return date.split('-')[0]
  }

  render() {
    let background = document.createElement("div")
    background.className = "infoBackground"

    let link = "https://image.tmdb.org/t/p/w1920"
    if (this.#data["backdrop_path"] != null) {
      link += this.#data["backdrop_path"]
    } else if (this.#data["poster_path"] != null){
      link += this.#data["poster_path"]
    }

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
            titleImg.src = "https://image.tmdb.org/t/p/w500" + res["logos"][0]["file_path"]
            this.#shadow.querySelector("#title").replaceWith(titleImg)
          }
        })
    } else if (this.#data["mediaType"] == "s") {
      getShowImages(this.#data["id"])
        .then(res => {
          if (res["logos"].length != 0) {
            titleImg.src = "https://image.tmdb.org/t/p/w500" + res["logos"][0]["file_path"]
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
    contentRating.style.display = "none"
    if(this.#data["mediaType"] == "m") {
      getMovieContentRating(this.#data["id"])
        .then(res => {
          let rating = res["results"].find(o => o["iso_3166_1"] == "US")
          if (rating) {
            for (let i = 0; i < rating["release_dates"].length; i++) {
              if (rating["release_dates"][i]["certification"] != "") {
                contentRating.textContent = rating["release_dates"][i]["certification"];
                contentRating.style.display = "block"
              }
            }
          } else {
            genres.removeChild(contentRating)
          }
        })
    } else if(this.#data["mediaType"] == "s") {
      getShowContentRating(this.#data["id"])
        .then(res => {
          let rating = res["results"].find(o => o["iso_3166_1"] == "US")["rating"]
          if (rating != undefined) {
            contentRating.textContent = rating
          } else {
            genres.removeChild(contentRating)
          }
        })
    }
    contentRating.className = "genre"

    if (yearDiv.textContent != "") {
      genres.appendChild(yearDiv)
    }
    if (rating.textContent != "") {
      genres.appendChild(rating)
    }

    if (this.#data["mediaType"] == "m") {
      let runtime = document.createElement("div")
      runtime.textContent = Math.floor(this.#data["runtime"] / 60) + "h " + this.#data["runtime"] % 60 + "m"
      runtime.className = "genre"
      if (runtime.textContent != "") {
        genres.appendChild(runtime)
      }
    }
    genres.appendChild(contentRating)
    genres.appendChild(language)

    let cont = document.createElement("div")
    let overview = document.createElement("div")
    overview.className = "desc"
    overview.textContent = this.#data["overview"]

    let desc = document.createElement("div") 
    desc.className = "descCont"
    desc.appendChild(genres)
    desc.appendChild(overview)

    cont.appendChild(desc)

    cont.style.display = "flex"


    let watchNowCont = document.createElement("div")
    watchNowCont.className = "watchNowCont"

    

    let playVidlink = document.createElement("button")
    playVidlink.className = "watchNow"
    playVidlink.textContent = "Watch Now" 

    let seasonNum = ""
    if (this.#data["mediaType"] == "s") {
      let season = 1
      let episode = 1
      if (state["shows"] != null) {
        if (this.#data["id"] in state["shows"]) {
          season = state["shows"][this.#data["id"]]["season"]
          episode = state["shows"][this.#data["id"]]["episode"]
        }       
      } else {
        stateListener.addEventListener("update-shows", () => {
          if (this.#data["id"] in state["shows"]) {
            season = state["shows"][this.#data["id"]]["season"]
            episode = state["shows"][this.#data["id"]]["episode"]
            seasonNum = "&s=" + season + "&e=" + episode
            console.log(seasonNum)
            playVidlink.addEventListener("click", () => {
              window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
            })
          }
        }, {once : true})
      }
      console.log(seasonNum)
      seasonNum = "&s=" + season + "&e=" + episode
    }

    playVidlink.addEventListener("click", () => {
      window.location.hash = "watch?id="+this.#data["id"] + "&t=" + this.#data["mediaType"] + seasonNum
    })
    watchNowCont.appendChild(playVidlink)

    let backArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:30px;"><path fill="white" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`

    let backArrowCont = document.createElement("div")
    backArrowCont.innerHTML = backArrow
    backArrowCont.className = "backArrowCont"

    backArrowCont.addEventListener("click", () => {
      window.location.hash = "#"
    });

    container.appendChild(backArrowCont)
    container.appendChild(title)
    container.appendChild(cont)
    container.appendChild(watchNowCont)


    let trailer = document.createElement('div');
    trailer.style.position = 'relative';

    const iframe = document.createElement('div');
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.pointerEvents = "none"

    let background2 = document.createElement("div") 
    background2.className = "bg bg2"
    background2.style.visibility = "hidden"
    background2.appendChild(iframe)

    let overlayBg2 = document.createElement("div")
    overlayBg2.className = "overlay"
    overlayBg2.style.visibility = "visible"

    let svgButton = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <g clip-path="url(#clip0_15_174)"> <rect width="24" height="24"></rect> <path d="M3 16V8H6L11 4V20L6 16H3Z" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M13 9C13 9 15 9.5 15 12C15 14.5 13 15 13 15" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M15 7C15 7 18 7.83333 18 12C18 16.1667 15 17 15 17" stroke="#fffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M17 5C17 5 21 6.16667 21 12C21 17.8333 17 19 17 19" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0_15_174"> <rect width="24" height="24"></rect> </clipPath> </defs> </g></svg>`
    let svgButtonM = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g stroke-linecap="round" stroke-linejoin="round"></g><g> <g clip-path="url(#clip0_15_183)"> <rect width="24" height="24"></rect> <path d="M3 16V8H6L11 4V20L6 16H3Z" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14.5 15L20.5 9" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> <path d="M14.5 9L20.5 15" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round"></path> </g> <defs> <clipPath id="clip0_15_183"> <rect width="24" height="24"></rect> </clipPath> </defs> </g></svg>`
    let muteButton = document.createElement("button") 
    muteButton.setAttribute("aria-muted", "true")
    muteButton.innerHTML = svgButtonM
    muteButton.className = "muteButton"

    background2.appendChild(muteButton)

    background.className += " bg"
    background.style.visibility = "visible"

    let backgroundCont = document.createElement("div")
    backgroundCont.className = "bgC"
    backgroundCont.appendChild(background2)
    backgroundCont.appendChild(overlayBg2)
    backgroundCont.appendChild(background)
    backgroundCont.appendChild(container)

    function switchBg() {
      let bg1Vis = background.style.visibility
      let bg2Vis = background2.style.visibility
      background.style.visibility = bg2Vis
      background2.style.visibility = bg1Vis
    }

    function setBg1() {
      background.style.visibility = "visible" 
      background2.style.visibility = "hidden"
    }
    

    this.#shadow.innerHTML = `
      <style>
        .muteButton {
          z-index:9999;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-radius:50%;
          position:absolute;
          top:50px;
          right:50px;
          border:none;
          background-color:color-mix(in srgb, var(--primary-200) 60%, transparent);
          height:50px;
          width:50px;
        }
        .muteButton:hover {
          background-color:var(--secondary-500);
          transform: scale(1.05);
          box-shadow: 0 0 20px rgba(color-mix(var(--secondary-500)) 0.6);
        }
        .backArrowCont {
          position:fixed;
          top:0;
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
        }
        .tagline {
          font-style: italic;
        }
        .desc {
          width:40vw;
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
          border:none;
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
          margin-top:4vh;
          display:flex;
          flex-wrap: wrap;
          gap:1vw;
        }
        .genre {
          flex: 0 0 auto;
          background-color:var(--primary-200);
          border-radius:30px;
          margin-bottom:1vh;
          padding:5px 15px;
        }

        .infoBoxContainer {
          position:absolute;
          bottom:0;
          color:var(--text-900);
          padding:2vh;
          margin-left:1vw;
          z-index:2000;
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
          background:
            linear-gradient(to right, var(--background-50), color-mix(in srgb, var(--background) 0%, transparent)),
            /*linear-gradient(to top, color-mix(in srgb, var(--background-50) 80%, transparent), color-mix(in srgb, var(--background-50) 0%, transparent)),*/
            url(${link});
          background-blend-mode: multiply;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          display:flex;
          flex-direction:column-reverse;
        }
        .overlay {
          background: linear-gradient(to top, var(--background-50), rgba(0,0,0,0));
          z-index:1000;
        }
        .bg, .overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          margin:0;
          padding:0;
        }

        .bgC {
          width: 100dvw;
          height: 100dvh;
        }
        @media (min-device-width: 320px) and (max-device-width: 480px) {
          .infoBackground {
            background-color:var(--background-50);
            background:
              linear-gradient(to right, color-mix(in srgb, var(--background) 50%, transparent), color-mix(in srgb, var(--background) 50%, transparent)),
              url(${link});
            background-position:center top;
            background-blend-mode: multiply;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            height:80vh;
            display:flex;
          }
          .titleImg {
            width:300px;
            margin-bottom:4vh;
          }
          .watchNowCont {
            width:100%;
            display:flex;
            justify-content:center;
            margin-top:1vh;
          }

        }
        @import url('https://fonts.googleapis.com/css?family=Inter:700|Inter:400');
      </style>
    `;

    this.#shadow.appendChild(backgroundCont)

    let trailerLink = "9WZllcEgWrM"
    if (this.#data["videos"]) {
      trailerLink = this.#data["videos"]["results"].find(o => o["type"] == "Trailer")["key"]
    }

    let hidden = false;

    function hideBox() {
      desc.style.overflow = "hidden";
    
      const height = desc.offsetHeight;
      desc.style.height = height + "px";
      desc.style.transition = "height 1s ease, opacity 1s ease, padding 1s ease, margin 1s ease";    
    
      titleImg.style.overflow = "hidden";
      const imgWidth = titleImg.offsetWidth;
      const imgHeight = titleImg.offsetHeight;
      titleImg.style.width = imgWidth + "px";
      titleImg.style.height = imgHeight + "px";
      titleImg.style.transition = "width 1s ease, height 1s ease";

      desc.offsetHeight;
      titleImg.offsetHeight;

      requestAnimationFrame(() => {
        desc.style.height = "0px";
        desc.style.opacity = "0";
        desc.style.paddingTop = "0px";
        desc.style.paddingBottom = "0px";
        desc.style.marginTop = "0px";
        desc.style.marginBottom = "0px";
        
        const imgWidth = 300;
        const imgHeight = titleImg.naturalHeight * (imgWidth / titleImg.naturalWidth);
        titleImg.style.width = imgWidth + "px";
        titleImg.style.height = imgHeight + "px";
      });
    
      desc.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "height") {
          desc.style.display = "none";
          desc.removeEventListener("transitionend", handler);
          hidden = true;
        }
      });
    }

    function showBox() {
      hidden = false;
      desc.style.display = "block";
      desc.style.overflow = "hidden";
    
      desc.style.height = "0px";
      desc.style.opacity = "0";
      desc.style.paddingTop = "0px";
      desc.style.paddingBottom = "0px";
      desc.style.marginTop = "0px";
      desc.style.marginBottom = "0px";

      desc.offsetHeight;
      titleImg.offsetHeight;
    
      requestAnimationFrame(() => {
        desc.style.transition = "height 1s ease, opacity 1s ease, padding 1s ease, margin 1s ease";
        desc.style.height = desc.scrollHeight + "px";
        desc.style.opacity = "1";
        desc.style.paddingTop = "";
        desc.style.paddingBottom = "";
        desc.style.marginTop = "";
        desc.style.marginBottom = "";

        const imgWidth = 500;
        const imgHeight = titleImg.naturalHeight * (imgWidth / titleImg.naturalWidth);
        titleImg.style.transition = "width 1s ease, height 1s ease";
        titleImg.style.width = imgWidth + "px";
        titleImg.style.height = imgHeight + "px";
      });
    
      desc.addEventListener("transitionend", function handler(e) {
        if (e.propertyName === "height") {
          desc.style.height = "";
          desc.style.overflow = "";
          desc.removeEventListener("transitionend", handler);
        }
      });
    }

    let player;

    muteButton.addEventListener("click", () => {
      if (muteButton.getAttribute("aria-muted") == "false") {
        muteButton.innerHTML = svgButtonM
        if (player) player.mute();
        muteButton.setAttribute("aria-muted", "true")
      } else if (muteButton.getAttribute("aria-muted") == "true") {
        muteButton.innerHTML = svgButton
        if (player) player.unMute();
        muteButton.setAttribute("aria-muted", "false")
      }
    })

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
      window.onYouTubeIframeAPIReady = () => createPlayer();
    } else {
      createPlayer();
    }

    let t1, t2, t3;

    function hideElems() {
      if (hidden == false) {
        clearTimeout(t3);
        t3 = setTimeout(hideBox(),1500)
      }
    }

    function showElems() {
      if (hidden == true) {
        clearTimeout(t3);
        t3 = setTimeout(showBox(),1500)
      }
    }

    function createPlayer() {
      player = new YT.Player(iframe, {
        videoId: trailerLink,
        playerVars: { autoplay: 1, controls: 0, mute: 1, disablekb: 1, fs: 0, modestbranding: 1, rel: 0, iv_load_policy: 3, cc_load_policy: 0, playsinline: 1, showinfo: 0, enablejsapi: 1 },
events: {
          onReady: () => {
            console.log("onready")
            t1 = setTimeout(() => {
              player.setPlaybackQuality('highres');
              player.seekTo(0);
              switchBg();
              t2 = setTimeout(() => {
                hideBox()
                container.addEventListener("mouseenter", showElems);
                container.addEventListener("mouseleave", hideElems);
              }, 1000)
            }, 4000);
            const interval = setInterval(() => {
              const currentTime = player.getCurrentTime();
              const duration = player.getDuration();
              if (duration - currentTime <= 8) {
                player.seekTo(0);
                player.playVideo();
              }
            }, 400);
          },
          onError: () => {
            console.log("onError")
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
            container.removeEventListener("mouseenter", showElems);
            container.removeEventListener("mouseleave", hideElems);
            setBg1()
            desc.style.height = desc.scrollHeight + "px";
            desc.style.opacity = "1";
            desc.style.paddingTop = "";
            desc.style.paddingBottom = "";
            desc.style.marginTop = "";
            desc.style.marginBottom = "";

            const imgWidth = 500;
            const imgHeight = titleImg.naturalHeight * (imgWidth / titleImg.naturalWidth);
            titleImg.style.width = imgWidth + "px";
            titleImg.style.height = imgHeight + "px";
          }
        }
      });
    }
  }
}
customElements.define("info-box", InfoBox);
