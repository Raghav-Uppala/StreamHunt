function setDarkTheme(bool) {
  if (bool) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
}
setDarkTheme(true)

let state = {
  "countryName":"United States",
  "countryCode":"US", 
}
