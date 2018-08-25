import React from 'react'
import Bookshelf from './Bookshelf'
import SearchPage from './SearchPage'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {

  state = {
    shelvedBooks: [],
    bookshelvesNames: ['Currently Reading', 'Want To Read', 'Read'],
    showSearchPage: false
  }

  componentDidMount = () => BooksAPI.getAll()
    .then(shelvedBooks => this.setState({ shelvedBooks }))

  changeShelf = (book, newShelf) => {
    const shelvedBooksCopy = this.state.shelvedBooks
    const bookIndex = shelvedBooksCopy.indexOf(book)
    shelvedBooksCopy[bookIndex].shelf = newShelf
    this.setState({ shelvedBooksCopy })

    BooksAPI.update(book, newShelf)
  }

  closeSearch = () => this.setState({ showSearchPage: false })

  render() {
    return (
      <div className="app">

        {/* TODO: Route using react-route-dom */}
        {this.state.showSearchPage ? (

          <SearchPage
            shelvedBooks={this.state.shelvedBooks}
            onCloseSearch={this.closeSearch}
          />

        ) : (

          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>

                {this.state.bookshelvesNames.map((bookshelfName, index) => (

                  <Bookshelf
                    key={index}
                    bookshelfName={bookshelfName}
                    shelvedBooks={this.state.shelvedBooks}
                    onShelfChange={this.changeShelf}
                  />

                ))}

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
