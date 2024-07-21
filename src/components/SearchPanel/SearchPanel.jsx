import './SearchPanel.css'

function SearchPanel({ updateSearch }) {
  const handleInput = (value) => {
    updateSearch(value)
  }
  return (
    <div className="search-wrapper">
      <input
        type="text"
        placeholder="Type to search..."
        className="search-input"
        onInput={(e) => handleInput(e.target.value)}
      />
    </div>
  )
}

export default SearchPanel
