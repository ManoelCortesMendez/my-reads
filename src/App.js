import React from 'react'
import { Link, Route } from 'react-router-dom'
import Bookshelf from './Bookshelf'
import SearchPage from './SearchPage'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {

  state = {
    shelvedBooks: [],
    bookshelvesNames: ['Currently Reading', 'Want To Read', 'Read']
  }

  componentDidMount = () => BooksAPI.getAll()
    .then(shelvedBooks => this.setState({ shelvedBooks }))

  changeShelf = (book, newShelf) => {
    const newShelvedBooks = this.state.shelvedBooks.map(shelvedBook => {
      if (shelvedBook.id === book.id) {shelvedBook.shelf = newShelf}
      return shelvedBook
    })

    this.setState({ newShelvedBooks })

    BooksAPI.update(book, newShelf)
  }

  addBook = book => this.setState({ shelvedBooks: this.state.shelvedBooks.concat(book) })

  render() {
    return (
      <div className="app">

        <Route path='/search' render={() => (
          <SearchPage
            shelvedBooks={this.state.shelvedBooks}
            onShelfChange={this.changeShelf}
            onBookAdd={this.addBook}
          />
        )}/>

        <Route exact path='/' render={() => (
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
                <Link to='/search'>Add a book</Link>
              </div>
            </div>
          )}/>

      </div>
    )
  }
}

export default BooksApp
