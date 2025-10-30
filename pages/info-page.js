class InfoPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {"id": null}
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
    let info = document.createElement("info-box")

    if (this.#params["id"] != null) {
      let infoData;
      if (this.#params["t"] == "m") {
        infoData = getMovieById(this.#params["id"])
      } else if (this.#params["t"] == "s") {
        infoData = getShowById(this.#params["id"])
      }
  
      infoData.then((res) => {
        res["mediaType"] = this.#params["t"]
        info.data = res
      })
    }
    this.#shadow.innerHTML = `
      <style>
        body {
          background-color:var(--background-50);
        }
      </style>
    `;
    this.#shadow.appendChild(info)
  }
}
customElements.define("info-page", InfoPage);
