import React from 'react'
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

    BooksAPI.update(book, newShelf)
  }

  searchBooks = query => {
    if (query) {
      BooksAPI.search(query).then(booksFound =>
        this.setState( { booksFound: ('error' in booksFound) ? [] : booksFound } )
      )
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
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input
                  type="text"
                  placeholder="Search by title or author"
                  onChange={event => this.searchBooks(event.target.value)}
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
                        <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
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
                      <div className="book-authors">{book.author}</div>
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
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
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
                            <div className="book-authors">{book.author}</div>
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
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
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
                            <div className="book-authors">{book.author}</div>
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
                              <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.thumbnail})` }}></div>
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
                            <div className="book-authors">{book.author}</div>
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
