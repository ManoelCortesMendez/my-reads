import React from 'react'
import coverNA from './icons/cover-na.png'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    query: '',
    myBooks: [],
    booksFound: []
  }

  componentDidMount() {
    BooksAPI.getAll().then(myBooks => this.setState({ myBooks }))
  }

  changeShelf = (book, newShelf) => {
    const bookIndex = this.state.myBooks.indexOf(book);
    // Copying the entire myBooks state isn't very efficient
    // TODO: Are there more efficient ways of doing the below?
    const myBooksCopy = this.state.myBooks;
    myBooksCopy[bookIndex].shelf = newShelf
    this.setState({ myBooksCopy })

    this.updateRemoteShelf(book, newShelf)
  }

  changeSearchShelf = (book, newShelf) => {
    const bookIndex = this.state.booksFound.indexOf(book);
    // Copying the entire myBooks state isn't very efficient
    // TODO: Are there more efficient ways of doing the below?
    const myBooksFoundCopy = this.state.booksFound;
    myBooksFoundCopy[bookIndex].shelf = newShelf
    this.setState({
      myBooksFound: myBooksFoundCopy,
      myBooks: this.state.myBooks.concat( book )
    })

    this.updateRemoteShelf(book, newShelf)
  }

  updateQuery = query => {
    this.setState({ query })
    if (query !== '') {
      this.searchBooks(query)
    } else {
      this.setState({ booksFound: [] })
    }
  }

  updateRemoteShelf(book, newShelf) {
    BooksAPI.update(book, newShelf)
  }

  searchBooks = query => {
    if (query) {
      BooksAPI.search(query).then(booksFound => {
        if ('error' in booksFound) {
          this.setState({ booksFound: [] })
        } else {
          const booksFoundWithShelf = booksFound.map(bookFound => {
            this.state.myBooks.map(myBook => {
              if (bookFound.id === myBook.id) {
                bookFound.shelf = myBook.shelf
              }
              return bookFound
            })
            return bookFound
          })

          this.setState({ booksFound: booksFoundWithShelf })
        }
      })
    } else {
      this.setState({ booksFound: [] })
    }
  }

  render() {
    return (

      // TODO: implement convenience object to avoid repeating this.state (see ListContacts.js)
      <div className="app">

        {/*TODO: Remove print statement*/}
        {/*{console.log(this.state.myBooks)}*/}

        {/*TODO: Replace with React Router*/}
        {/*Fork: Show search page*/}

        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
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

                {this.state.booksFound
                  .map((book, index) =>
                  <li key={index}>
                    <div className="book">
                      <div className="book-top">
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`) || `url(${coverNA})` }}></div>
                        <div className="book-shelf-changer">
                          <select value={book.shelf || 'none'} onChange={event => this.changeSearchShelf(book, event.target.value)}>
                            <option value="move" disabled>Move to...</option>
                            <option value="currentlyReading">Currently Reading</option>
                            <option value="wantToRead">Want to Read</option>
                            <option value="read">Read</option>
                            <option value="none">None</option>
                          </select>
                        </div>
                      </div>
                      <div className="book-title">{book.title}</div>
                      {book.authors && book.authors.map(author =>
                        <div className="book-authors">{author}</div>
                      )
                      || <div className="book-authors">Author(s) N/A</div>}
                    </div>
                  </li>
                )}

              </ol>
            </div>
          </div>

        // Fork: Show bookshelves
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Currently Reading</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">

                      {/* First Bookshelf: Currently Reading */}
                      {this.state.myBooks
                        .filter(book => book.shelf === 'currentlyReading')
                        .map((book, index) =>
                        <li key={index}>
                          <div className="book">
                            <div className="book-top">
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`) || `url(${coverNA})` }}></div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={event => this.changeShelf(book, event.target.value)}>
                                  <option value="move" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map(author =>
                              <div className="book-authors">{author}</div>
                            )
                            || <div className="book-authors">N/A</div>}
                          </div>
                        </li>
                      )}

                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Want to Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">

                      {/* Second Bookshelf: Want to Read */}
                      {this.state.myBooks
                        .filter(book => book.shelf === 'wantToRead')
                        .map((book, index) =>
                        <li key={index}>
                          <div className="book">
                            <div className="book-top">
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`) || `url(${coverNA})` }}></div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={event => this.changeShelf(book, event.target.value)}>
                                  <option value="move" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map(author =>
                              <div className="book-authors">{author}</div>
                            )
                            || <div className="book-authors">N/A</div>}
                          </div>
                        </li>
                      )}

                    </ol>
                  </div>
                </div>
                <div className="bookshelf">
                  <h2 className="bookshelf-title">Read</h2>
                  <div className="bookshelf-books">
                    <ol className="books-grid">

                      {/* Third Bookshelf: Read */}
                      {this.state.myBooks
                        .filter(book => book.shelf === 'read')
                        .map((book, index) =>
                        <li key={index}>
                          <div className="book">
                            <div className="book-top">
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: (book.imageLinks && `url(${book.imageLinks.thumbnail})`) || `url(${coverNA})` }}></div>
                              <div className="book-shelf-changer">
                                <select value={book.shelf} onChange={event => this.changeShelf(book, event.target.value)}>
                                  <option value="move" disabled>Move to...</option>
                                  <option value="currentlyReading">Currently Reading</option>
                                  <option value="wantToRead">Want to Read</option>
                                  <option value="read">Read</option>
                                  <option value="none">None</option>
                                </select>
                              </div>
                            </div>
                            <div className="book-title">{book.title}</div>
                            {book.authors && book.authors.map(author =>
                              <div className="book-authors">{author}</div>
                            )
                            || <div className="book-authors">N/A</div>}
                          </div>
                        </li>
                      )}

                    </ol>
                  </div>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
