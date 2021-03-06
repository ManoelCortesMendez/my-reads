import React from 'react'
import { Link } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'
import coverNA from './icons/cover-na.png'

class SearchPage extends React.Component {

  state = {
    query: '',
    searchedBooks: []
  }

  updateQuery = query => {
    this.setState({ query })
    query ? this.searchBooks(query) : this.setState({ searchedBooks: [] })
  }

  changeShelf = (book, newShelf) => {
    const newSearchedBooks = this.state.searchedBooks.map(searchedBook => {
      if (searchedBook.id === book.id) {searchedBook.shelf = newShelf}
      return searchedBook
    })

    let newBook = true
    this.props.shelvedBooks.map(shelvedBook => {
      if (shelvedBook.id === book.id) {
        this.props.onShelfChange(shelvedBook, newShelf)
        newBook = false
      }
      return null
    })

    if (newBook) {
      book.shelf = newShelf
      this.props.onBookAdd(book)
    }

    this.setState({ newSearchedBooks })

    BooksAPI.update(book, newShelf)
  }

  searchBooks = query => {
    BooksAPI.search(query).then(searchedBooks => {
      if ('error' in searchedBooks) {return this.setState({ searchedBooks: [] })}

      const shelvedSearchedBooks = searchedBooks
        .map(searchedBook => {this.props.shelvedBooks
          .map(shelvedBook => {
            if (searchedBook.id === shelvedBook.id) {searchedBook.shelf = shelvedBook.shelf}
            return searchedBook
          })
          return searchedBook
        })

      this.setState({ searchedBooks: shelvedSearchedBooks })
    })
  }

  render() {
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link
            to='/'
            className="close-search">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <input
              type="text"
              placeholder="Search by title or author"
              value={this.state.query}
              onChange={event => this.updateQuery(event.target.value)}
            />
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">

            {this.state.searchedBooks
              .map((book, index) => (
                <li key={index}>
                  <div className="book">
                    <div className="book-top">
                      <div
                        className="book-cover"
                        style={{
                          width: 128,
                          height: 193,
                          backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`)
                            || `url(${coverNA})`
                        }}
                      />
                      <div className="book-shelf-changer">
                        <select
                          value={book.shelf || 'none'}
                          onChange={event => this.changeShelf(book, event.target.value)}>
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
                    )) || <div className="book-authors">Author(s) N/A</div>}

                  </div>
                </li>
              )
            )}

          </ol>
        </div>
      </div>
    )
  }
}

export default SearchPage
