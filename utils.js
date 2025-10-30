function renderToCarousel(data, genres, elem) {
  let el = null
  if (elem["id"] != null) {
    el = document.getElementById(elem["id"])
  } else if (elem["elem"] != null) {
    el = elem["elem"];
  } 
  if (el) {
    el.updateDG(data["results"], genres["genres"])
  }
}

function setDarkTheme(bool) {
  if (bool) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}
