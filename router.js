function findHash() {
  let theHash = window.location.hash;
  let [path, queryString] = theHash.split("?");
  let params = {};

  if (theHash == 0) {
    path = "_index"
    return {path, params}
  }
  if (path.length == 0) {
    path = "_index";
  }

  if (path[0] == "#") {
    path = path.substring(1);
  }

  if (queryString) {
    queryString.split("&").forEach(pair => {
      const [key, value] = pair.split("=");
      params[key] = decodeURIComponent(value);
    });
  }
  return {path, params};
}

let routes = {
  "_index" : "home-page",
  "search" : "search-page",
  "info" : "info-page",
  "watch" : "watch-page",
}

function findPage({path, params}) {
  if (path in routes) {
    let page = document.createElement(routes[path])
    if (page && Object.keys(params).length != 0) {
      console.log(params)
      page.params = params
    }
    let main =  document.querySelector("#app")
    main.innerHTML = ""
    main.appendChild(page)
  }
}

window.addEventListener("hashchange", function() {
  findPage(findHash());
});

window.addEventListener("DOMContentLoaded", function() {
  findPage(findHash());
});
