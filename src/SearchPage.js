import React from 'react'
import coverNA from './icons/cover-na.png'

class SearchPage extends React.Component {
  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.props.query}
              onChange={event => this.props.onUpdateQuery(event.target.value)}
              />

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">

            {this.props.booksFound
              .map((book, index) =>
              <li key={index}>
                <div className="book">
                  <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`) || `url(${coverNA})` }}></div>
                    <div className="book-shelf-changer">
                      <select
                        value={book.shelf || 'none'}
                        onChange={event => this.props.onChangeSearchShelf(book, event.target.value)}>
                        <option value="move" disabled>Move to...</option>
                        <option value="currentlyReading">Currently Reading</option>
                        <option value="wantToRead">Want to Read</option>
                        <option value="read">Read</option>
                        <option value="none">None</option>
                      </select>
                    </div>
                  </div>
                  <div className="book-title">{book.title}</div>
                  {(book.authors && book.authors.map((author, index) =>
                    <div className="book-authors" key={index}>{author}</div>
                  ))
                  || <div className="book-authors">Author(s) N/A</div>}
                </div>
              </li>
            )}

          </ol>
        </div>
      </div>
    )
  }
}

export default SearchPage
