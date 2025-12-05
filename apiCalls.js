const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWZkNTU3ODE1YjM0YWFkNDM4MmJiMGQ3MTk5MjY5NCIsIm5iZiI6MTcxMjgyNjY0MC4yOTYsInN1YiI6IjY2MTdhOTEwNmI1ZmMyMDE2MzI4NTNjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d8iWgFOyoeYag8YdBFGxs_swLYc4PRovUCmMfTrREQM"
  }
};

// Movie API calls

async function getTopRatedMovies() {
  console.log("h")
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
  return fetch("https://api.themoviedb.org/3/movie/" + id + "?append_to_response=videos", options)
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
  return fetch("https://api.themoviedb.org/3/tv/" + id + "?append_to_response=videos", options)
    .then(res => res.json())
    .catch(err => console.error(err))
}

async function getShowSeasonsById(id, seasons) {
  let promise = []

  for (let p = 1; p <= Math.ceil(seasons/20); p++) {
    let max = 20 + (p-1) * 20
    if (p == Math.ceil(seasons/20)) {
      max = seasons
    }
    let seasonAppend = ""
    for (let i = (p-1)*20; i < max; i++) {
      if (i != 0 ) {
        seasonAppend += ","
      }
      seasonAppend += "season/" + (i+1)
    }
    promise.push(fetch("https://api.themoviedb.org/3/tv/" + id + "?append_to_response=" + seasonAppend, options))
  }
  return Promise.all(promise)
    .then(responses => Promise.all(responses.map(r => r.json())))
    .then(dataArray => {
      let newData = dataArray[0]
      if (dataArray.length > 1) {
        for (let i = 1; i < dataArray.length; i++) {
          Object.entries(dataArray[i]).map(entry => {
            if (entry[0].split("/")[0] == "season") {
              newData[entry[0]] = entry[1]
            }
          });
        }
      }
      return newData
    })    
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


// User related calls 

async function userGetMovies() {
  try {
    const [status, movieCollection] = await firebaseGetCollection("Movies")
    if (movieCollection == "empty") {
      setState("movies", {})
      return ["error", null]
    } else {
      let data = {}
      movieCollection.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setState("movies", data)
      return ["success", data]
    }
  } catch (error) {
    return ["error", error]
  }
}

async function userUpdateMovie(id, timeStamp) {
  try {
    const movieCollection = await firebaseUpdateDocCollection("Movies", {"timeStamp" : timeStamp}, id)
    let newState = state["movies"]
    newState[id] = {"timeStamp" : timeStamp}
    setState("movies", newState)
    return movieCollection
  } catch (error) {
    return ["error", error]
  }
}

async function userAddMovie(id) {
  try {
    const movieCollection = await firebaseAddToCollection("Movies", {"timeStamp" : "0"}, id)
    return movieCollection
  } catch (error) {
    return ["error", error]
  }
}

async function userGetShows() {
  try {
    const [status, showCollection] = await firebaseGetCollection("Shows")
    if (showCollection == "empty") {
      setState("shows", {})
      return ["error", null]
    } else {
      let data = {}
      showCollection.forEach(doc => {
        data[doc.id] = doc.data();
      });
      setState("shows", data)
      return ["success", data]
    }
  } catch (error) {
    return ["error", error]
  }
}

async function userUpdateShow(id, ep, season) {
  try {
    const showCollection = await firebaseUpdateDocCollection("Shows", {"episode" : ep, "season" : season}, id)
    let newState = state["shows"]
    newState[id] = {"episode" : ep, "season" : season}
    setState("shows", newState)
    return showCollection
  } catch (error) {
    return ["error", error]
  }
}

async function userAddShow(id, ep, season) {
  try {
    const showCollection = await firebaseAddToCollection("Shows", {"episode" : ep, "season" : season}, id)
    return showCollection
  } catch (error) {
    return ["error", error]
  }
}

// Person related calls

async function getPersonByID(id) {
  try {
    const det = await fetch("https://api.themoviedb.org/3/person/" + id + "?language=en-US&append_to_response=movie_credits,tv_credits", options)
    return det.json()
  } catch (error) {
    return ["error", error]
  }
}

async function getPeopleByName(name) {
  try {
    const det = await fetch("https://api.themoviedb.org/3/search/person?query=" + name + "?language=en-US", options)
    return det.json()
  } catch (error) {
    return ["error", error]
  }
}
