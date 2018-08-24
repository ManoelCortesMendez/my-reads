import React from 'react'
import Bookshelf from './Bookshelf'
import SearchPage from './SearchPage'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  
  state = {
    myBooks: [],
    showSearchPage: false
  }

  componentDidMount() {
    BooksAPI.getAll().then(myBooks => this.setState({ myBooks }))
  }

  changeShelf = (book, newShelf) => {
    const bookIndex = this.state.myBooks.indexOf(book);
    const myBooksCopy = this.state.myBooks;
    myBooksCopy[bookIndex].shelf = newShelf
    this.setState({ myBooksCopy })

    BooksAPI.update(book, newShelf)
  }

  render() {
    return (

      <div className="app">

        {this.state.showSearchPage ? (
          <SearchPage
            myBooks={this.state.myBooks}
          />

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
