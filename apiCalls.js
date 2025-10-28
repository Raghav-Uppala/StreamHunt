const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmYWZkNTU3ODE1YjM0YWFkNDM4MmJiMGQ3MTk5MjY5NCIsIm5iZiI6MTcxMjgyNjY0MC4yOTYsInN1YiI6IjY2MTdhOTEwNmI1ZmMyMDE2MzI4NTNjZiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.d8iWgFOyoeYag8YdBFGxs_swLYc4PRovUCmMfTrREQM'
  }
};

async function getTopRated() {
  return fetch('https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1', options)
    .then(res => res.json())
    .catch(err => console.error(err));
}

async function getMovieGenreIds() {
  return fetch('https://api.themoviedb.org/3/genre/movie/list', options)
    .then(res => res.json())
    .catch(err => console.error(err));
}
