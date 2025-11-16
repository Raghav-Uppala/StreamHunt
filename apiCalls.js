const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWZkNTU3ODE1YjM0YWFkNDM4MmJiMGQ3MTk5MjY5NCIsIm5iZiI6MTcxMjgyNjY0MC4yOTYsInN1YiI6IjY2MTdhOTEwNmI1ZmMyMDE2MzI4NTNjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d8iWgFOyoeYag8YdBFGxs_swLYc4PRovUCmMfTrREQM"
  }
};

// Movie API calls

async function getTopRatedMovies() {
  return fetch("https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function getPopularMovies() {
  return fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function getMovieGenreIds() {
  return fetch("https://api.themoviedb.org/3/genre/movie/list", options)
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function getMovieById(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id, options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getMovieByName(name) {
  return fetch("https://api.themoviedb.org/3/search/movie?query=" + name, options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getSimilarMovies(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/similar?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getMovieWatchProviders(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/watch/providers", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getMovieImages(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/images?language=en", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getMovieContentRating(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/release_dates", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getMovieCredits(id) {
  return fetch("https://api.themoviedb.org/3/movie/" + id + "/credits?language=en-US", options)
    .then(res => res.json())
    .catch(err => console.error(err))
}



// Show API calls

async function getTopRatedShows() {
  return fetch("https://api.themoviedb.org/3/tv/top_rated?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function getPopularShows() {
  return fetch("https://api.themoviedb.org/3/tv/popular?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err));
}


async function getShowById(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id, options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getShowSeasonsById(id, seasons) {
  let seasonAppend = ""
  for (let i = 0; i < seasons; i++) {
    if (i != 0 ) {
      seasonAppend += ","
    }
    seasonAppend += "season/" + (i+1)
  }
  return fetch("https://api.themoviedb.org/3/tv/" + id + "?append_to_response=" + seasonAppend, options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getShowByName(name) {
  return fetch("https://api.themoviedb.org/3/search/tv?query=" + name, options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getSimilarShows(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id + "/similar?language=en-US&page=1", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getShowWatchProviders(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id + "/watch/providers", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getShowImages(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id + "/images?language=en", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getShowContentRating(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id + "/content_ratings", options)
    .then(res => res.json())
    .catch(err => console.error(err))
} 

async function getShowCredits(id) {
  return fetch("https://api.themoviedb.org/3/tv/" + id + "/aggregate_credits?language=en-US", options)
    .then(res => res.json())
    .catch(err => console.error(err))
}
