class WatchPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {"p": "1","t":"m", "id": "2", "notLoaded": false}
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
      "5" : "i",
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
      { label: "Server 4", value: "4" },
      //{ label: "Server 5", value: "5" },
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
              console.log(results)
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
        if (state["shows"] && state["shows"][this.#params["id"]]) {
          userUpdateShow(this.#params["id"], e.detail.episode, e.detail.season*1).then(res => console.log(res))
        }
        episodeSelector.episode = {"season":e.detail.season*1, "episode":e.detail.episode} 
      });

      details.appendChild(episodeSelector)
    }

    let updateTimer = null
    function addDoc(params) {
      updateTimer = setTimeout(async () => {
        userAddShow(params["id"], params["e"], params["s"])
      }, 10000)
    }

    function cancel() {
      if (updateTimer) {
        console.log("canceled")
        clearTimeout(updateTimer)
        updateTimer = null
      }
    }

    if (state["shows"] && !(this.#params["id"] in state["shows"])) {
      if(!("notLoaded" in this.#params) && this.#params["e"] != 1) {
        addDoc(this.#params)
      }
    }

    let backButton = document.createElement("button")
    backButton.textContent = "go back"
    backButton.addEventListener("click", () => {
      window.location.hash = "#info?id=" + this.#params["id"] + "&t=s"
      cancel()
    })

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
    this.#shadow.appendChild(backButton)

  }
}
customElements.define("watch-page", WatchPage);
