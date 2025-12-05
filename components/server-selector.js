class ServerSelector extends HTMLElement {
  #shadow

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this._options = [];
    this._selected = null;
  }

  set options(arr) {
    this._options = arr;
    this.render();
  }

  get value() {
    return this._selected;
  }

  render() {
    let container = document.createElement("div")
    container.className = "serverSelectorCont"

    this._options.forEach((opt, i) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "serverSelector";
      input.value = opt.value;

      if (i === 0) {
        input.checked = true;
        this._selected = opt.value;
      }

      input.addEventListener("change", (e) => {
        this._selected = e.target.value;

        this.dispatchEvent(new CustomEvent("new-server", {
          detail: { value: this._selected },
          bubbles: true,  // lets it bubble up to parent elements
          composed: true  // allows it to cross shadow DOM boundary
        }));
      });

      label.appendChild(input);
      label.append(" " + opt.label);
      container.appendChild(label);
    });

    this.#shadow.innerHTML = `
      <style>
        label { 
          display: flex;
          cursor: pointer;
          align-items:center;
          justify-content:center;
          padding:0 10px;
          border-radius:50px;
        }
        input[type=radio] {
          appearance: none;
          position:absolute;
          width:0px;
          height:0px;
        }
        label:has(input[type=radio]:checked) {
          background-color:var(--background-200);
        }
        .serverSelectorCont {
          color:var(--text-950);
          display:flex;
        }
      </style>
    `;

    this.#shadow.appendChild(container)
  }
}

customElements.define("server-selector", ServerSelector);

