function findHash() {
  var theHash = window.location.hash;
  if (theHash.length == 0) { theHash = "_index"; }
  return theHash;
}

let routes = {
  "_index" : "home-page",
  "search" : "search-page"
}

function findPage(hash) {
  if (hash[0] == "#") {
    hash = hash.substring(1);
  }
  if (hash in routes) {
    document.body.innerHTML = "<" + routes[hash] + "> </" + routes[hash] + ">";
  }
}

window.addEventListener("hashchange", function() {
  console.log("hashchange event");
  findPage(findHash());
});

window.addEventListener("DOMContentLoaded", function() {
  console.log("DOMContentLoaded event");
  findPage(findHash());
});
