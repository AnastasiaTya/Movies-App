import { Pagination, Alert } from 'antd'

import './PaginationFooter.css'

function PaginationFooter({ clickPage, totalResults, error, movies }) {
  if (movies.length === 0) {
    return (
      <div className="nonePagination">
        <Alert message="Nothing was found" type="warning" description="Check the spelling of the movie and try again" />
      </div>
    )
  }
  const handleChange = (page) => {
    clickPage(page)
  }
  if (error) return null
  return (
    <div className="pagination-footer">
      <Pagination
        defaultCurrent={1}
        showSizeChanger={false}
        total={totalResults}
        align="center"
        defaultPageSize={20}
        onChange={handleChange}
      />
    </div>
  )
}

export default PaginationFooter
