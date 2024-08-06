import { format } from 'date-fns'
import { Card, Rate } from 'antd'

import './CardItem.css'
import none from '../../../public/img/none.jpg'
import isNull from '../../utils/isNull'

function getRating(rating) {
  if (rating <= 3) {
    return 'ratingBad'
  }
  if (rating <= 5) {
    return 'ratingMedium'
  }
  if (rating <= 7) {
    return 'ratingGood'
  }
  return 'ratingPerfect'
}

function CardItem({
  title,
  date,
  genre,
  description,
  image,
  genres,
  rating,
  addRating,
  movieId,
  isRating,
  type,
  myRating,
}) {
  const getGenreName = (id) => {
    if (id === undefined) {
      return id
    }
    const result = genres.find((item) => item.id === id)
    return result.name
  }

  const ratingClassName = getRating(rating)

  let value = 0
  if (type === 'rated') {
    value = isRating
  } else {
    value = myRating
  }
  return (
    <div className="card-item">
      <img src={isNull(image) ? none : image} width={183} height={281} alt="movie" />
      <Card.Grid className="card-grid">
        <div className="tittle-wrapper">
          <h2 className="card-title">{title}</h2>
        </div>

        <div className={`card-rating ${ratingClassName}`}>
          <span className="rating-num">{rating}</span>
        </div>
        <p className="card-data">{date ? format(new Date(date), 'MMMM d, yyyy') : ''}</p>
        <div className="genres-wrapper">
          {genre.map((g) => (
            <div key={g} className="card-genres">
              <span className="genres-description">{getGenreName(g)}</span>
            </div>
          ))}
        </div>
        <p className="title-description">{description}</p>
        <Rate count={10} className="stars" value={value} allowHalf onChange={(record) => addRating(record, movieId)} />
      </Card.Grid>
    </div>
  )
}

export default CardItem
