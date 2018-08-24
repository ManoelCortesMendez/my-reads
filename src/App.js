import React from 'react'
import Bookshelf from './Bookshelf'
import SearchPage from './SearchPage'
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
      console.log(query);
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

      <div className="app">

        {this.state.showSearchPage ? (
          <SearchPage
            query={this.state.query}
            booksFound={this.state.booksFound}
            onUpdateQuery={this.updateQuery}
            onChangeSearchShelf={this.changeSearchShelf}
          />

        // Fork: Show bookshelves
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>

                <Bookshelf
                  bookshelfName='currentlyReading'
                  myBooks={ this.state.myBooks }
                  onShelfChange={ this.changeShelf }
                />

                <Bookshelf
                  bookshelfName='wantToRead'
                  myBooks={ this.state.myBooks }
                  onShelfChange={ this.changeShelf }
                />

                <Bookshelf
                  bookshelfName='read'
                  myBooks={ this.state.myBooks }
                  onShelfChange={ this.changeShelf }
                />

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
