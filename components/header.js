class CustomHeader extends HTMLElement {
  #shadow;
  #query;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
    this.#query = ""
    this.render();
  }

  get query() {
    return this.#query
  }

  set query(val) {
    this.#query = val
    this.render()
  }
  
  search(query) {
    let uri = "#search?q=" + encodeURIComponent(query)
    window.location.hash = uri
  }

  render() {
    //let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkTheme(true)

    let container = document.createElement("div")
    container.id = "container"
    container.style.display = "flex"

    //const sunIcon = `
    //  <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
    //    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
    //  </svg>
    //`;
    
    //const moonIcon = `
    //  <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
    //    <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
    //  </svg>
    //`;

    //let themeSwitcher = document.createElement("button")
    //themeSwitcher.id = "themeSwitcher"
    //themeSwitcher.innerHTML = prefersDark ? sunIcon : moonIcon;
    //themeSwitcher.querySelector("svg").style.width = "32px";
    //themeSwitcher.querySelector("svg").style.height = "32px";
    //themeSwitcher.setAttribute("aria-pressed", prefersDark)
    //themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-50").trim();
    //themeSwitcher.style.border = "none"
    //themeSwitcher.style.borderRadius = "4px"
    //themeSwitcher.addEventListener('click',() => { 
    //  const pressed = themeSwitcher.getAttribute("aria-pressed") === "true";
    //  themeSwitcher.setAttribute("aria-pressed", String(!pressed));
    //  setDarkTheme(!pressed)
    //  themeSwitcher.innerHTML = !pressed ? sunIcon : moonIcon;
    //  themeSwitcher.querySelector("svg").style.width = "32px";
    //  themeSwitcher.querySelector("svg").style.height = "32px";
    //  themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-50").trim();
    //});
    //themeSwitcher.addEventListener('mouseover', function () {
    //  themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-200").trim();
    //});
    //
    //themeSwitcher.addEventListener('mouseout', function () {
    //  themeSwitcher.style.backgroundColor = 'initial';
    //});

    let searchBarCont = document.createElement("div")
    searchBarCont.className = "searchBarCont"

    let searchIcon = document.createElement("button")
    searchIcon.innerHTML = `<svg class="searchIconSvg" aria-labelledby="title desc" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7"><title id="title">Search Icon</title><desc id="desc">A magnifying glass icon.</desc><g class="search-path" fill="none" stroke="#848F91"><path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4"/><circle cx="8" cy="8" r="7"/></g></svg>`
    searchIcon.setAttribute("aria-pressed", "false")
    searchIcon.className = "searchIcon"

    searchIcon.addEventListener("click", ()=>{
      let pressed = searchIcon.getAttribute("aria-pressed");
      if (pressed == "false") {
        searchIcon.setAttribute("aria-pressed", "true")
        void searchBar.offsetWidth;
        requestAnimationFrame(() => {
          searchBar.classList.add("open");
        });
        searchBar.style.display = "flex"
        searchBar.focus();
        searchBar.addEventListener("blur", close)
        searchBar.addEventListener("keydown", close)
        function close(e) {
          if(e.type == "blur" || (e.type == "keydown" && e.keyCode == 27)) {
            searchBar.classList.remove("open");
            searchIcon.setAttribute("aria-pressed", "false")
            searchBar.removeEventListener("blur", close)
            searchBar.removeEventListener("keydown", close)
          }
        }
      } else if (pressed == "true"){
        searchIcon.setAttribute("aria-pressed", "false")
        searchBar.classList.remove("open");
        searchBar.addEventListener(
          "transitionend",
          () => {
            searchBar.style.display = "none"
          },
          { once: true }
        );
      } 
    }); 

    let searchBar = document.createElement("input")
    searchBar.className = "searchBar"
    searchBar.value = this.#query
    searchBarCont.appendChild(searchBar);

    searchBar.addEventListener("keypress", (e) => {
      if(e.key == "Enter") {
        this.search(searchBar.value)
      }
    })
    searchBarCont.appendChild(searchIcon)


    let loginform = document.createElement("signup-form")
    loginform.setAttribute("popover", "auto")
    loginform.id = "loginForm"

    let openButton = document.createElement("button")
    openButton.textContent = "login"
    openButton.setAttribute("popovertarget", "loginForm")

    stateListener.addEventListener("update-signedIn", (e) => {
      if (e.detail.value == true) {
        openButton.textContent = "logout"
        openButton.setAttribute("popovertarget", "")
        openButton.addEventListener("click", () => {
          firebaseSignOut()
        }, { once: true })
      } else if (e.detail.value == false) {
        openButton.textContent = "Login"
        openButton.setAttribute("popovertarget", "loginForm")
      }
    })

    stateListener.addEventListener("update-user", () => {userGetShows()})

    let logo = document.createElement("div")
    logo.textContent = "StreamHunt"
    logo.style.color = "white"
 
    //container.appendChild(themeSwitcher);
    
    let rightCont = document.createElement("div")
    rightCont.className += "cont"
    rightCont.appendChild(searchBarCont)
    rightCont.appendChild(openButton)
    rightCont.appendChild(loginform)

    let leftCont = document.createElement("div")
    leftCont.className += "cont"
    leftCont.appendChild(logo)

    container.appendChild(leftCont)
    container.appendChild(rightCont)
    

    this.#shadow.innerHTML = `
      <style>
        .searchIcon {
          background-color:transparent;
          border:none;
          border-radius:10px;
          padding:10px;
          margin-top:10px;
          margin-right:10px;
          align-items:center;

          &:hover {
            background-color:var(--primary-100);
          }
        }

        .searchIcon:hover .search-path {
          stroke:var(--secondary-500);
        }

        .searchIconSvg {
          display: inline-block;
          width: 30px;
          height: 30px;

          & .search-path {
            stroke:white;
          }
        }
        .searchBar {
          height:20px;
          width: 0;
          opacity: 0;
          transform: scaleX(0);
          transform-origin: right;
          transition: all 0.3s ease;
          border:none;
          border-bottom: 1px solid #ccc;
          border-radius: 4px;
          padding: 4px 8px;
          background-color:transparent;
          color:var(--text-900);

          &:focus {
            outline:none;
          }
        }
        .searchBar.open {
          width: 200px;
          opacity: 1;
          transform: scaleX(1);
        }
        .searchBarCont {
          display:flex;
          align-items:center;
          flex-direction:row;
        }
        #container {
          display:flex;
          align-items:center;
          justify-content: space-between;
          height:50px;
        }
        .cont {
          display:flex;
          align-items:center;
          flex-direction:row;
        }
      </style>
      `;
    this.#shadow.appendChild(container);
    
  }
}
customElements.define("custom-header", CustomHeader);
