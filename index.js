
function jumpToTimestamp() {
  player.seekTo(0, true);
}

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
  "signedIn" : false,
  "user" : null,
  "shows" : null,
  "movies" : null,
}

const stateListener = new EventTarget();

function setState(name, val) {
  state[name] = val
  stateListener.dispatchEvent(new CustomEvent("update-"+name, {
    detail: { "name" : name, "value" : val},
    bubbles: true,
    composed: true
  }));
}

function getState(name) {
  return state[name]
}

setState("signedIn", false)
setState("user", null)



stateListener.addEventListener("update-user", () => {userGetShows()})
