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
      "3" : "s",
      "4" : "a",
    }
    let player = document.createElement("player-frame")
    let modData = structuredClone(this.#params)
    if (this.#params["p"] != null) {
      modData["p"] = players[this.#params["p"]] 
    } else {
      modData["p"] = "v"
    }
    console.log(modData)
    player.data = modData

    this.#shadow.innerHTML = ""
    this.#shadow.appendChild(player)
  }
}
customElements.define("watch-page", WatchPage);
