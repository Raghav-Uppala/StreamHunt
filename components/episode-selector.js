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

  updateEpisodes(season, episodeSelector) {
    episodeSelector.innerHTML = ""
    console.log(this.#data, "Season " + season)
    let s = this.#data.find(o => o.name == "Season " + season);
    for (let i = 1; i <= s["episode_count"]; i++) {
      let episode = document.createElement("option")
      episode.value = season + "," + i
      episode.textContent = "Episode " + i
      episodeSelector.appendChild(episode)
    }
  }

  selectEpisode(season, episode, seasonSelector, episodeSelector) {
    Array.from(seasonSelector.options).forEach((option) => {
      if (option.value == season) {
        option.setAttribute("selected", "selected")
      }
    })
    Array.from(episodeSelector.options).forEach((option) => {
      if (option.value == season + "," + episode) {
        option.setAttribute("selected", "selected")
      }
    })
  }

  render() {
    if (this.#data.length != 0) {
      let seasonSelector = document.createElement("select")
      seasonSelector.name = "Seasons"
      seasonSelector.id = "seasonSelector"

      for (let i = 0; i < this.#data.length; i++) {
        if (this.#data[i]["name"].includes("Season")) {
          let season = document.createElement("option")
          season.value = this.#data[i]["name"].split(" ")[1]
          season.textContent = this.#data[i]["name"]
          seasonSelector.appendChild(season)
        }
      }


      let episodeSelector = document.createElement("select")
      this.updateEpisodes(this.#episode["season"], episodeSelector)
      this.selectEpisode(this.#episode["season"], this.#episode["episode"], seasonSelector, episodeSelector)

      seasonSelector.addEventListener("change", (e) => {
        let season = e.target.value
        this.updateEpisodes(season, episodeSelector)
      })

      episodeSelector.addEventListener("change", (e) => {
        let selected = e.target.value;
        let season = selected.split(",")[0]
        let episode = selected.split(",")[1]

        this.dispatchEvent(new CustomEvent("new-episode", {
          detail: { season: season, episode: episode },
          bubbles: true,
          composed: true
        }));
      });


      this.#shadow.innerHTML = ``;
      this.#shadow.appendChild(seasonSelector)
      this.#shadow.appendChild(episodeSelector)
    }
  }
}
customElements.define("episode-selector", EpisodeSelector);
