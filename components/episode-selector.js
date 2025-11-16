class EpisodeSelector extends HTMLElement {
  #shadow;
  #data;
  #episode;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.#episode = {"season":1, "episode":1} 
    this.render()
  }

  set data(value) {
    this.#data = structuredClone(value)
    this.render()
  }

  get data() {
    return this.#data
  }
  set episode(value) {
    this.#episode = structuredClone(value)
    this.render()
  }

  get episode() {
    return this.#data
  }

  showEpisodes(seasons, season, selector) {
    selector.innerHTML = ""
    let back = document.createElement("div")
    let backArrow = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="backArrow"><path fill="white" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`
    let text = document.createElement("div")
    text.className = "text"
    text.textContent = "Season " + season
    back.className = "backSeason"
    back.insertAdjacentHTML('beforeend', backArrow);
    back.appendChild(text)
    back.addEventListener("click", () => {
      this.showSeasons(seasons, selector)
    })
    back.tabIndex = 0

    selector.appendChild(back)

    back.focus()

    for (let i = 0; i < seasons[season]["episode_count"]; i++) {
      let ep = document.createElement("div")
      ep.tabIndex = 0
      ep.className = "selectorItem episode"
      ep.textContent = "Episode " + (i+1)
      if (Object.keys(seasons[season]).includes("episodes")) {
        ep.textContent += ": " + seasons[season]["episodes"][i]["name"]
      }
      ep.addEventListener("click", () => {
        this.dispatchEvent(new CustomEvent("new-episode", {
          detail: { season: season, episode: i+1 },
          bubbles: true,
          composed: true
        }));
      })
      if (season == this.#episode["season"] && i+1 == this.#episode["episode"]) {
        ep.className += " currentEpisode"
      }
      selector.appendChild(ep)
    }
  }

  showSeasons(seasons, selector) {
    selector.innerHTML = ""
    for (let i = 0; i < Object.keys(seasons).length; i++) {
      let season = document.createElement("div")
      season.tabIndex = 0
      season.textContent = "Season " + (i+1)
      season.className = "selectorItem season"
      season.id = "season" + (i+1)
      season.insertAdjacentHTML('beforeend', `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="seasonArrow"><path fill="white" d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z"/></svg>`
);
      season.addEventListener("click", () => {
        this.showEpisodes(seasons, i+1, selector)
      })

      selector.appendChild(season)
    }
  }

  closeSelector(e, selector, selectorButton, container, clickFun) {
    if (e.composedPath()[0] != selector && e.composedPath()[0] != selectorButton) {
      container.removeChild(selector)
      document.removeEventListener("click", clickFun);
    }
  }

  render() {
    if (this.#data.length != 0) { 
      let nextEpisode = document.createElement("button")
      nextEpisode.className = "nextEpisode"
      nextEpisode.textContent = "Next Episode"

      let container = document.createElement("div")
      container.className = "container"

      let selectorButton = document.createElement("button")
      selectorButton.className = "selectorButton"
      selectorButton.textContent = "episode"
      selectorButton.setAttribute("aria-pressed", "false")

      selectorButton.addEventListener("click", ()=>{
        const pressed = selectorButton.getAttribute("aria-pressed") == "true"
        selectorButton.setAttribute("aria-pressed", !pressed)

        if (!pressed) {
          container.appendChild(selector)
          this.showEpisodes(seasons, this.#episode["season"], selector)

          selector.focus()

          const clickFun = (e) => { 
            if (!selector.contains(e.relatedTarget)) {
              container.removeChild(selector)
              selectorButton.setAttribute("aria-pressed", "false")
            } else {
              selector.focus()
            }
          }
          selector.addEventListener("focusout", clickFun)
        } else if (pressed) {
          container.removeChild(selector)
        }
      })
      
      let selector = document.createElement("div")
      selector.className = "selector"
      selector.tabIndex = -1

      let seasons = {}

      for (let i = 0; i < this.#data.length; i++) {
        if (this.#data[i]["season_number"] != 0) {
          seasons[this.#data[i]["season_number"]] = this.#data[i]
        }
      }

      nextEpisode.addEventListener("click", () => {
        let nextep = this.#episode["episode"]
        let nexts = this.#episode["season"] 
        if (seasons[this.#episode["season"]]["episode_count"] > this.#episode["episode"]) {
          nextep = +this.#episode["episode"] + 1
          nexts = this.#episode["season"]
        } else {
          if (Object.keys(seasons).length > this.#episode["season"]) {
            nextep = 1
            nexts = +this.#episode["season"] + 1
          }
        }
        this.dispatchEvent(new CustomEvent("new-episode", {
          detail: { season: nexts, episode: nextep },
          bubbles: true,
          composed: true
        }));
      })


      this.#shadow.innerHTML = `
        <style>
          .container {
            position: relative;
            width:200px;
          }
          .selector {
            background-color:var(--background-50);
            color:var(--text-900);
            position: absolute;
            top:-300px;
            left:-120px;
            z-index:100000;
            height:300px;
            width:300px;
            overflow-y:scroll;

          }
          .backSeason, .selectorItem.season{
            display:flex;
            align-items:center;
            gap:0.5rem;
          }
          .backArrow {
            height:20px;
            width:20px;
          }
          .selectorItem, .backSeason {
            color:var(--text-900);
            margin:5px 5px 5px 10px;
            cursor:pointer;
            padding:5px 5px 5px 10px;
            &:hover {
              background-color:var(--secondary-300);
            }
          }
          .seasonArrow {
            margin-left:20px;
            height:20px;
            width:20px;
            transform:rotate(180deg);
            visibility:hidden;
          }
          .selectorItem.episode {
            margin-left:30px;
          }
          .selectorItem.season {
            display:flex;
            justify-content:space-between;
            &:hover .seasonArrow {
              visibility:visible;
            }
          }
          .currentEpisode {
            font-weight:bold;
          }
        </style>
      `;
      container.appendChild(selectorButton)
      if (this.#data.length != 0) {
        if (this.#episode["season"] != Object.keys(seasons).length || this.#episode["episode"] != seasons[this.#episode["season"]]["episode_count"]) {
          container.appendChild(nextEpisode)
        }
      }
      this.#shadow.appendChild(container)
      //this.#shadow.appendChild(seasonSelector)
      //this.#shadow.appendChild(episodeSelector)
    }
  }
}
customElements.define("episode-selector", EpisodeSelector);
