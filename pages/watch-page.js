class WatchPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {"p": "1","t":"m", "id": "2"}
    this.render();
  }

  set params(value) {
    this.#params = value;
    this.render()
  }

  get params() {
    return this.#params;
  }
  render() {
    let players = {
      "1" : "v",
      "2" : "k",
      "3" : "a",
      "4" : "s",
    }
    let player = document.createElement("player-frame")
    let modData = structuredClone(this.#params)
    if (this.#params["p"] != null) {
      modData["p"] = players[this.#params["p"]] 
    } else {
      modData["p"] = "v"
    }
    player.data = modData

    let serverSelector = document.createElement("server-selector");

    serverSelector.options = [
      { label: "Server 1", value: "1" },
      { label: "Server 2", value: "2" },
      { label: "Server 3", value: "3" },
      { label: "Server 4", value: "4" }
    ];
    serverSelector.addEventListener("new-server", (e) => {
      modData["p"] = players[e.detail.value]
      player.data = modData
    });

    let details = document.createElement("div")
    details.className = "details"

    details.appendChild(serverSelector)
    if (this.#params["t"] == "s") {
      let episodeSelector = document.createElement("episode-selector")
      episodeSelector.episode = {"season":this.#params["s"], "episode":this.#params["e"]} 
      getShowById(this.#params["id"])
        .then(res => {
          episodeSelector.data = res["seasons"]
          getShowSeasonsById(this.#params["id"], res["number_of_seasons"])
            .then(results => {
              let data = []
              for (let i = 0; i < res["number_of_seasons"]; i++) {
                data.push(results["season/" + (i+1)])
                data[i]["season_number"] = i + 1
                data[i]["episode_count"] = data[i]["episodes"].length 
              }
              episodeSelector.data = data
            })
        })

      episodeSelector.addEventListener("new-episode", (e) => {
        window.location.hash = "#watch?id=" + this.#params["id"] + "&t=s&s=" + e.detail.season + "&e=" + e.detail.episode
        episodeSelector.episode = {"season":e.detail.season, "episode":e.detail.episode} 
      });

      details.appendChild(episodeSelector)
    }

    this.#shadow.innerHTML = `
      <style>
        .details {
          display:flex;
          justify-content:space-between;
        }
      </style>
    `;
    this.#shadow.appendChild(player)
    this.#shadow.appendChild(details)

  }
}
customElements.define("watch-page", WatchPage);
