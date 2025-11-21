class PlayerFrame extends HTMLElement {
  #shadow;
  #data

  constructor() {
    super();
    this.#data = [];
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = structuredClone(value);
    this.render();
  }

  connectedCallback() {
    this.render();
  }


  render() {
    let iframe = document.createElement("iframe")
    iframe.setAttribute("referrerpolicy", "no-referrer")

    let link = ""
    if (this.#data["p"] == "v") {
      let type = "movie"
      let season_ep = ""
      if (this.#data["t"] == "m") {
        type = "movie"
      } else if (this.#data["t"] = "s") {
        type = "tv"
        season_ep = "/" + this.#data["s"] + "/" + this.#data["e"]
      }
      link = "https://vidlink.pro/" + type + "/" + this.#data["id"] + season_ep
    } else if (this.#data["p"] == "e") {
      link = "https://www.2embed.cc/"
      if (this.#data["t"] == "m") {
        link += "embed/" + this.#data["id"]
      } else if (this.#data["t"] = "s") {
        link += "embedtv/" + this.#data["id"] + "&s=" + this.#data["s"] + "&e=" + this.#data["e"]
      }
    } else if (this.#data["p"] == "a") {
      link = "https://player.autoembed.cc/embed/"
      if (this.#data["t"] == "m") {
        link += "movie/" + this.#data["id"]
      } else if (this.#data["t"] == "s") {
        link += "tv/" + this.#data["id"] + "/" + this.#data["s"] + "/" + this.#data["e"]
      }
    } else if (this.#data["p"] == "s") {
      link = "https://vidsrc-embed.ru/embed"
      if (this.#data["t"] == "m") {
        link += "/movie/" + this.#data["id"]
      } else if (this.#data["t"] == "s") {
        link += "/tv/" + this.#data["id"] + "/" + this.#data["s"] + "-" + this.#data["e"]
      }
    } else if (this.#data["p"] == "k") {
      link = "https://www.vidking.net/embed/"
      if (this.#data["t"] == "m") {
        link += "movie/" + this.#data["id"]
      } else if (this.#data["t"] == "s") {
        link += "tv/" + this.#data["id"] + "/" + this.#data["s"] + "/" + this.#data["e"]
      }
    } else if (this.#data["p"] == "i") {
      link = "https://vidsrc.icu/embed/"
      if (this.#data["t"] == "m") {
        link += "movie/" + this.#data["id"]
      } else if (this.#data["t"] == "s") {
        link += "tv/" + this.#data["id"] + "/" + this.#data["s"] + "/" + this.#data["e"]
      }
    }
    console.log(link)
    iframe.src = link
    iframe.setAttribute("allowfullscreen", "")
    iframe.setAttribute("frameborder", "0")
    iframe.className = "iframe"

    let backArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="width:30px;"><path fill="white" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`

    let backArrowCont = document.createElement("div")
    backArrowCont.innerHTML = backArrow
    backArrowCont.className = "backArrowCont"

    backArrowCont.addEventListener("click", () => {
      window.location.hash = "";
    });

    this.#shadow.innerHTML = `
      <style>
        .iframe {
          width:100vw; 
          height:100vh;
        }
        .backArrowCont {
          height:30px;
          width:30px;
          position:absolute;
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
      </style>
    `;


    let container = document.createElement("div")
    container.appendChild(iframe)

    this.#shadow.appendChild(container)
  }
}
customElements.define("player-frame", PlayerFrame);
