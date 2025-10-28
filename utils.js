function renderToCarousel(data, genres, elem) {
  let el = null
  if (elem["id"] != null) {
    el = document.getElementById(elem["id"])
  } else if (elem["elem"] != null) {
    el = elem["elem"];
  } 
  if (el) {
    console.log(el)
    el.updateDG(data["results"], genres["genres"])
  }
}

