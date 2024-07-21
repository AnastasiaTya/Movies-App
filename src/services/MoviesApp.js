/* eslint-disable class-methods-use-this */
export default class MoviesApp {
  #token =
    'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyZWNmYmM4NzE5ZTJhYjk1NmM1YThlYWE0ZjM4NDRkYiIsIm5iZiI6MTcyMDc5NDY3Mi4wMTkyODYsInN1YiI6IjY2OTEzYmM0NjBmZjgyZGRkNjgwOTRkNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.a7dYu_6EXirRr9mo5_WlnwmvBkV47mXzB402-azYAp0'

  #apiKey = '2ecfbc8719e2ab956c5a8eaa4f3844db'

  #baseUrl = 'https://api.themoviedb.org/3/'

  options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${this.#token}`,
    },
  }

  async fetchRating(sessionId, movieId, rating) {
    const res = await fetch(
      `${this.#baseUrl}movie/${movieId}/rating?api_key=${this.#apiKey}&guest_session_id=${sessionId}`,
      {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
        },
        body: JSON.stringify({ value: rating }),
      }
    )
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  }

  async ratedMovies(sessionId) {
    const res = await fetch(
      `${this.#baseUrl}guest_session/${sessionId}/rated/movies?language=en-US&page=1&sort_by=created_at.asc`,
      this.options
    )
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  }

  async getMoviesByGenre() {
    const res = await fetch(`${this.#baseUrl}genre/movie/list?language=en&api_key=${this.#apiKey}`, this.options)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  }

  fetchResources = async (url, options) => {
    const res = await fetch(url, options)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  }

  async createGuestSession() {
    const res = await fetch(`${this.#baseUrl}authentication/guest_session/new?api_key=${this.#apiKey}`)
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`)
    }
    return res.json()
  }

  getMovie(page = 1, query = 'return') {
    return this.fetchResources(
      `${this.#baseUrl}search/movie?include_adult=false&language=en-US&query=${query}&page=${page}&api_key=${this.#apiKey}`,
      this.options
    )
  }
}
