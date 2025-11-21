class CreditsList extends HTMLElement {
  #shadow;
  #data;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#data = [];
    this.render();
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = structuredClone(value);
    this.render();
  }

  render() {
    let container = document.createElement("div")
    container.className = "creditsContainer"

    let count = 0;
    if (Object.keys(this.#data).length != 0) {
      if (this.#data["mediaType"] == "m") {
        let crew = [this.#data["crew"].find(o => o["job"] == "Director"), this.#data["crew"].find(o => o["job"] == "Screenplay"), ...this.#data["crew"].filter(o => o["job"] == "Writer")] 
        let prev_ids = []
        for (let i = 0; i < crew.length; i++) {

          let elem = crew[i]

          if (elem == undefined) {
            continue
          }

          if (prev_ids.includes(elem["id"])) {
            let jobR = container.querySelector("#" + "crew" + elem["id"])
            jobR.textContent += ", " + elem["job"]
            continue
          }
          prev_ids.push(elem["id"])

          let elemDiv = document.createElement("div")
          elemDiv.className = "creditContainer"

          let img = document.createElement("img")
          img.className = "creditImg"

          let name = document.createElement("p")
          name.textContent = elem["name"]
          name.className = "text name"

          let job = document.createElement("p")
          if (this.#data["mediaType"] == "m") {
            job.textContent = elem["job"]
            job.id = "crew" + elem["id"]
            job.className = "text"
          } else {
            job.textContent = elem["jobs"][0]["job"]
            job.id = "crew" + elem["id"]
            job.className = "text"
          }

          img.src = 'https://image.tmdb.org/t/p/h632/' + elem["profile_path"]
          if (elem["profile_path"] == null || elem["profile_path"] == undefined) {
            img.src = "https://placehold.co/182x278/60656b/FFF?text=No+Poster"
          }

          elemDiv.appendChild(img)
          elemDiv.appendChild(name)
          elemDiv.appendChild(job)
          container.appendChild(elemDiv)
          count++
        }
      }

      for (let i = 0; i <= 5; i++) {
        let elem = this.#data["cast"][i]

        if (elem == undefined) {
          continue
        }

        let elemDiv = document.createElement("div")
        elemDiv.className = "creditContainer"

        let img = document.createElement("img")
        img.className = "creditImg"

        let name = document.createElement("p")
        name.textContent = elem["name"]
        name.className = "text name"

        let character = document.createElement("p")
        character.className = "text"
        if (this.#data["mediaType"] == "m") {
          character.textContent = elem["character"]
        } else {
          character.textContent = elem["roles"][0]["character"]
          if (elem["roles"].length > 1) {
            character.textContent += ", " + elem["roles"][1]["character"]
          }
          if (elem["roles"].length > 2) {
            character.textContent += " and " + (elem["roles"].length - 2) + " more..."
          }
        }

        img.src = 'https://image.tmdb.org/t/p/w185/' + elem["profile_path"]
        if (elem["profile_path"] == null || elem["profile_path"] == undefined) {
          img.src = "https://placehold.co/182x513/60656b/FFF?text=No+Poster"
        }

        elemDiv.appendChild(img)
        elemDiv.appendChild(name)
        elemDiv.appendChild(character)
        container.appendChild(elemDiv)
        count++
      }
    }

    let leftButton = document.createElement("div")
    leftButton.className = "leftButton"
    
    let leftArrow = document.createElement("div")
    leftArrow.className = "leftArrow"
    leftButton.appendChild(leftArrow)
    leftArrow.addEventListener("click", () => {
      container.scrollBy({ left: -window.innerWidth * 0.8, top: 0, behavior: 'smooth' })
    })

    let rightButton = document.createElement("div")
    rightButton.className = "rightButton"

    let rightArrow = document.createElement("div")
    rightArrow.className = "rightArrow"
    rightButton.appendChild(rightArrow)
    rightArrow.addEventListener("click", () => {
      container.scrollBy({ left: window.innerWidth * 0.8, top: 0, behavior: 'smooth' })
    })

    let finalCont = document.createElement("div")
    finalCont.className = "finalCont"

    if (window.innerWidth < (count * 200)) {
      finalCont.appendChild(leftButton)
      finalCont.appendChild(container)
      finalCont.appendChild(rightButton)
    } else {
      finalCont.appendChild(container)
    }

    this.#shadow.innerHTML = `
      <style>
        .finalCont {
          display:flex;
        }
        .creditsContainer {
          display:flex;
          gap:2rem;
          wdith:100dvw;
          flex-direction:row;
          width:100dwv;
          overflow-x:scroll;
          scrollbar-width: none;
        }
        .creditContainer {
          display: flex;
          flex: 0 0 auto;
          flex-direction: column;
          width:185px;
          color:var(--text-900);
          background-color:var(--primary-100);
          border-radius:10px;
        }
        .creditContainer:hover {
          background-color:var(--secondary-100);
        }
        .creditImg {
          border-radius:10px 10px 0px 0px;
          height:auto;
          width:100%;
        }
        .name {
          font-weight:bold;
        }
        .text {
          padding:5px;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
          max-width: 100%;
          margin: 0;
        }
        .leftButton, .rightButton {
          width:300px;
          height:513px;
          position:absolute;
          pointer-events: none;
        }
        .leftButton {
          left:0;
        }
        .rightButton {
          right:0;
        }

        .leftArrow, .rightArrow {
          border: solid var(--secondary-500);
          width:50px;
          height:50px;
          display: inline-block;
          margin-top:185px;
          cursor: pointer;
          pointer-events: auto;
        }
        .leftArrow {
          border-width: 0 10px 10px 0;
          margin-left:20px;
          transform: rotate(135deg);
          -webkit-transform: rotate(135deg);
        }
        .rightArrow {
          border-width: 10px 10px 0 0;
          margin-left:220px;
          transform: rotate(45deg);
          -webkit-transform: rotate(45deg);
        }
      </style>
    `;

    this.#shadow.appendChild(finalCont)
  }
}
customElements.define("credits-list", CreditsList);
