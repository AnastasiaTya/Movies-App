import { Spin, Alert } from 'antd'

import CardItem from '../CardItem'

import './CardList.css'

function CardList({ movies, loading, error, genres, addRating, type }) {
  const spin = <Spin size="large" />
  if (loading) {
    return <div className="card-spin__wrapper">{spin}</div>
  }
  const err = (
    <div className="card-error__wrapper">
      <Alert
        message="Error"
        description="Oops... Something went wrong. It is possible that your VPN is disabled or our server is temporarily unavailable. Check your internet connection and try again."
        type="error"
        showIcon
      />
    </div>
  )
  if (error) return <div className="card-error__wrapper">{err}</div>
  const movie = movies.map((film) => {
    const { id, title, date, genre, description, image, rating, isRating, myRating } = film
    return (
      <CardItem
        key={id}
        movieId={id}
        title={title}
        date={date}
        genre={genre}
        description={description}
        image={image}
        genres={genres}
        rating={rating}
        addRating={addRating}
        isRating={isRating}
        type={type}
        myRating={myRating}
      />
    )
  })
  const spinner = loading ? spin : null
  const content = !loading ? movie : null
  const errMessage = error ? err : null
  return (
    <div className="card-list__wrapper">
      {spinner}
      {content}
      {errMessage}
    </div>
  )
}

export default CardList
