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
    modData["watchProgress"] = 0
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
    function addDocShow(params) {
      updateTimer = setTimeout(async () => {
        userAddShow(params["id"], params["e"], params["s"])
      }, 10000)
    }
    function addDocMovie(params) {
      updateTimer = setTimeout(async () => {
        userAddMovie(params["id"])
      }, 10000)
    }

    function cancel() {
      if (updateTimer) {
        clearTimeout(updateTimer)
        updateTimer = null
      }
    }

    if (state["shows"] && !(this.#params["id"] in state["shows"]) && this.#params["t"] == "s") {
      if(!("notLoaded" in this.#params) && this.#params["e"] != 1) {
        addDocShow(this.#params)
      }
    }

    if (state["movies"] && (this.#params["id"] in state["movies"]) && this.#params["t"] == "m") {
      if(!("notLoaded" in this.#params)) {
        modData["watchProgress"] = state["movies"][this.#params["id"]]["timeStamp"]
        console.log(state["movies"][this.#params["id"]]["timeStamp"])
        player.data = modData
      }
    } else if (state["movies"] && !(this.#params["id"] in state["movies"]) && this.#params["t"] == "m") {
      if(!("notLoaded" in this.#params)) {
        addDocMovie(this.#params["id"])
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

    //if (state["movies"] && this.#params["t"] == "m") {
    //  if(!("notLoaded" in this.#params)) {
    //    window.addEventListener('message', (event) => {
    //      if (event.origin == 'https://vidlink.pro') {
    //        if (event.data?.type === 'MEDIA_DATA') {
    //          const mediaData = event.data.data;
    //          console.log(Math.abs(state["movies"][this.#params["id"]]["timeStamp"] - mediaData[this.#params["id"]]["progress"]["watched"]))
    //          if (Math.abs(state["movies"][this.#params["id"]]["timeStamp"] - mediaData[this.#params["id"]]["progress"]["watched"]) > 30) {
    //            console.log("h")
    //            userUpdateMovie(this.#params["id"], mediaData[this.#params["id"]]["progress"]["watched"])
    //          }
    //        }
    //      } else if (event.origin == "https://www.vidking.net") {
    //        const mediaData = event.data.data;
    //        console.log(event.data)
    //        if (Math.abs(state["movies"][this.#params["id"]]["timeStamp"] - mediaData[this.#params["id"]][""]["watched"]) > 30) {
    //          console.log("h")
    //          userUpdateMovie(this.#params["id"], mediaData[this.#params["id"]]["progress"]["watched"])
    //        }
    //      } 
    //    });
    //  }
    //}

  }
}
customElements.define("watch-page", WatchPage);
