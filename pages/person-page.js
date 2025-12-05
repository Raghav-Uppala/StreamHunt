class PersonPage extends HTMLElement {
  #shadow;
  #params;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: 'open' });
    this.#params = {}
  }

  set params(value) {
    this.#params = value;
    this.render()
  }

  get params() {
    return this.#params;
  }

  render() {
    let container = document.createElement("div")

    getPersonByID(this.#params["id"])
      .then((res) => {
        let name = document.createElement("h1")
        name.textContent = res["name"]
        name.className += "text"

        let main = document.createElement("div")
        main.className = "main"

        let content = document.createElement("div")
        content.className = "content"

        let bio = document.createElement("p")
        bio.textContent = res["biography"]
        bio.className += "text"

        content.appendChild(bio)

        let sidebar = document.createElement("div")
        sidebar.className = "sidebar"

        let profilePic = document.createElement("img")
        profilePic.className = "profilePic"
        profilePic.src = "https://image.tmdb.org/t/p/h632/" + res["profile_path"]

        let birthday = document.createElement("p")
        birthday.textContent = res["birthday"]
        birthday.className = "text"

        let knownFor = document.createElement("p")
        knownFor.textContent = res["known_for_department"]
        knownFor.className = "text"

        let placeOfBirth = document.createElement("p")
        placeOfBirth.textContent = res["place_of_birth"]
        placeOfBirth.className = "text"

        let rating = document.createElement("p")
        rating.textContent = Math.round(res["popularity"] * 10)/10
        rating.className = "text"

        sidebar.appendChild(profilePic)
        sidebar.appendChild(knownFor)
        sidebar.appendChild(birthday)
        sidebar.appendChild(placeOfBirth)
        sidebar.appendChild(rating)

        main.appendChild(sidebar)
        main.appendChild(content)

        let carouselM = document.createElement("carousel-slider")
        let headerM = document.createElement("h1")
        headerM.textContent = "Movies"
        headerM.className = "text"

        let finalDataMovies = []
        if (res["movie_credits"]["cast"].length != 0) {
          finalDataMovies.push(...res["movie_credits"]["cast"])
        }
        if (res["movie_credits"]["crew"].length != 0) {
          finalDataMovies.push(...res["movie_credits"]["cast"])
        }

        let carouselT = document.createElement("carousel-slider")
        let headerT = document.createElement("h1")
        headerT.textContent = "Shows"
        headerT.className = "text"

        let finalDataTV = []
        if (res["tv_credits"]["cast"].length != 0) {
          finalDataTV.push(...res["tv_credits"]["cast"])
        }
        if (res["tv_credits"]["crew"].length != 0) {
          finalDataTV.push(...res["tv_credits"]["crew"])
        }

        container.appendChild(name)
        container.appendChild(main)

        if (finalDataMovies.length != 0) {
          carouselM.data = finalDataMovies 
          container.appendChild(headerM)
          container.appendChild(carouselM)
        }
        if (finalDataTV.length != 0) {
          carouselT.data = finalDataTV 
          container.appendChild(headerT)
          container.appendChild(carouselT)
        }

      })

    this.#shadow.innerHTML = `
      <style>
        .text {
          color:var(--text-900);
        }
        .main {
          display:flex;
          gap:1em;
        }
        .profilePic {
          width:185px;
          height:276.4px;
          border-radius:10px 10px 0px 0px;
          height:auto;
        }
      </style>
    `;

    this.#shadow.appendChild(container)
  }
}
customElements.define("person-page", PersonPage);
