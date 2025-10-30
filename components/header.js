class CustomHeader extends HTMLElement {
  #shadow;

  constructor() {
    super();
    this.#shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  search(query) {
    let uri = "#search?q=" + encodeURIComponent(query)
    console.log(uri)
    window.location.hash = uri
  }

  render() {
    let prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkTheme(prefersDark)

    let container = document.createElement("div")
    container.id = "header"
    container.style.display = "flex"

    const sunIcon = `
      <svg fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
        <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
      </svg>
    `;
    
    const moonIcon = `
      <svg fill="black" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
        <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
      </svg>
    `;

    let themeSwitcher = document.createElement("button")
    themeSwitcher.id = "themeSwitcher"
    themeSwitcher.innerHTML = prefersDark ? sunIcon : moonIcon;
    themeSwitcher.querySelector("svg").style.width = "32px";
    themeSwitcher.querySelector("svg").style.height = "32px";
    themeSwitcher.setAttribute("aria-pressed", prefersDark)
    themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
    themeSwitcher.style.border = "none"
    themeSwitcher.style.borderRadius = "4px"
    themeSwitcher.addEventListener('click',() => { 
      const pressed = themeSwitcher.getAttribute("aria-pressed") === "true";
      themeSwitcher.setAttribute("aria-pressed", String(!pressed));
      setDarkTheme(!pressed)
      themeSwitcher.innerHTML = !pressed ? sunIcon : moonIcon;
      themeSwitcher.querySelector("svg").style.width = "32px";
      themeSwitcher.querySelector("svg").style.height = "32px";
      themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background").trim();
    });
    themeSwitcher.addEventListener('mouseover', function () {
      themeSwitcher.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue("--background-200").trim();
    });
    
    themeSwitcher.addEventListener('mouseout', function () {
      themeSwitcher.style.backgroundColor = 'initial';
    });

    let searchBar = document.createElement("input")


    searchBar.addEventListener("keypress", (e) => {
      if(e.key == "Enter") {
        this.search(searchBar.value)
      }
    })
    
    container.appendChild(themeSwitcher);
    container.appendChild(searchBar)
    

    this.#shadow.innerHTML = `
      <style>
      </style>
      `;
    this.#shadow.appendChild(container);
    
  }
}
customElements.define("custom-header", CustomHeader);
