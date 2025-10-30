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

    const serverSelector = document.createElement("server-selector");

    // list of options
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

    this.#shadow.innerHTML = ""
    this.#shadow.appendChild(player)
    this.#shadow.appendChild(serverSelector)
  }
}
customElements.define("watch-page", WatchPage);
