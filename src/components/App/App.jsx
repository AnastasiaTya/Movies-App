import { Component } from 'react'
import debounce from 'lodash/debounce'

import './App.css'
import { Provider } from '../GenresContext'
import validateText from '../../utils/validateText'
import MoviesApp from '../../services/MoviesApp'
import CardList from '../CardList'
import PaginationFooter from '../PaginationFooter'
import TabsHeader from '../TabsHeader'
import SearchPanel from '../SearchPanel'

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      type: 'search',
      genres: [],
      error: false,
      guestSessionId: 1,
      loading: true,
      search: {
        movies: [],
        currentPage: 1,
        totalResults: 0,
        query: undefined,
      },
      rated: {
        movies: [],
        loading: true,
        currentPage: 1,
        totalResults: 0,
      },
    }
    this.moviesApp = new MoviesApp()
    this.debouncedUpdateCardList = debounce(this.updateCardList.bind(this), 500)
  }

  componentDidMount() {
    this.updateCardList()
    this.createGuestSession()
    this.getMoviesByGenre()
  }

  componentDidUpdate(_, prevState) {
    if (prevState.search.currentPage !== this.state.search.currentPage) {
      this.updateCardList()
    }
    if (prevState.search.query !== this.state.search.query) {
      this.debouncedUpdateCardList()
    }
    if (prevState.type !== this.state.type) {
      if (this.state.type === 'search') {
        this.updateCardList()
      } else {
        this.addRatedMovies()
      }
    }
  }

  getMoviesByGenre() {
    this.moviesApp.getMoviesByGenre().then((data) => {
      this.setState({ genres: data.genres })
    })
  }

  addRating = (value, movieId) => {
    const sessionId = this.state.guestSessionId
    this.moviesApp.fetchRating(sessionId, movieId, value).catch(this.onError)
    this.setState((prevState) => {
      const updatedSearchMovies = prevState.search.movies.map((movie) =>
        movie.id === movieId ? { ...movie, myRating: value } : movie
      )
      return {
        search: {
          ...prevState.search,
          movies: updatedSearchMovies,
        },
      }
    })
  }

  onError = () => {
    this.setState({ error: true, loading: false })
  }

  clickPage = (page) => {
    this.setState((prevState) => ({
      search: {
        ...prevState.search,
        currentPage: page,
      },
    }))
  }

  updateSearch = (value) => {
    this.setState((prevState) => ({
      search: {
        ...prevState.search,
        query: value,
        currentPage: 1,
      },
    }))
  }

  addRatedMovies = () => {
    this.setState({ loading: true, error: false })
    const sessionId = this.state.guestSessionId
    this.moviesApp
      .ratedMovies(sessionId)
      .then((data) => {
        const { total_results: totalResults, results } = data
        const movies = results.map((movie) => ({
          title: movie.title,
          date: movie.release_date,
          genre: movie.genre_ids,
          description: validateText(movie.overview, 139),
          image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
          id: movie.id,
          rating: movie.vote_average.toFixed(1),
          isRating: movie.rating,
        }))
        this.setState((prevState) => ({
          rated: {
            ...prevState,
            movies,
            totalResults,
          },
        }))
      })
      .catch(this.onError)
      .finally(() => this.setState({ loading: false }))
  }

  toggleTabs = () => {
    this.setState(({ type }) => {
      if (type === 'search') {
        return { type: 'rated' }
      }
      return { type: 'search' }
    })
  }

  updateCardList() {
    this.setState({ loading: true, error: false })
    const { search, rated } = this.state
    const { currentPage, query } = search
    this.moviesApp
      .getMovie(currentPage, query)
      .then((data) => {
        const { total_results: totalResults, results } = data
        const movies = results.map((movie) => {
          const ratedMovie = rated.movies.find((ratedFilm) => ratedFilm.id === movie.id)
          return {
            title: movie.title,
            date: movie.release_date,
            genre: movie.genre_ids,
            description: validateText(movie.overview, 139),
            image: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
            id: movie.id,
            rating: movie.vote_average.toFixed(1),
            myRating: ratedMovie ? ratedMovie.isRating : 0,
          }
        })
        this.setState((prevState) => ({
          search: {
            ...prevState.search,
            movies,
            totalResults,
          },
        }))
      })
      .catch(this.onError)
      .finally(() => this.setState({ loading: false }))
  }

  createGuestSession() {
    this.moviesApp
      .createGuestSession()
      .then((data) => {
        const guestSessionId = data.guest_session_id
        this.setState({ guestSessionId })
      })
      .catch(this.onError)
  }

  render() {
    const { search, error, type, loading } = this.state
    const { movies, totalResults } = search
    return (
      <Provider value={this.state.genres}>
        <div className="wrapper">
          <div className="wrapper-position">
            <TabsHeader toggleTabs={this.toggleTabs} addRatedMovies={this.addRatedMovies} />
          </div>
          {type === 'search' ? (
            <>
              <SearchPanel updateSearch={this.updateSearch} />
              <CardList movies={movies} loading={loading} error={error} addRating={this.addRating} type={type} />
              <PaginationFooter clickPage={this.clickPage} totalResults={totalResults} movies={movies} error={error} />
            </>
          ) : (
            <div className="rated-wrapper">
              <CardList
                movies={this.state.rated.movies}
                loading={loading}
                error={error}
                addRating={this.addRating}
                type={type}
              />
            </div>
          )}
        </div>
      </Provider>
    )
  }
}
