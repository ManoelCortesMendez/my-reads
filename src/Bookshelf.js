import React from 'react'
import coverNA from './icons/cover-na.png'

class Bookshelf extends React.Component {

  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.bookshelfName}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">

            {this.props.shelvedBooks
              .filter(book =>
                book.shelf.toLowerCase() === this.props.bookshelfName.toLowerCase().replace(/\s/g, ''))
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
                          value={book.shelf}
                          onChange={event => this.props.onShelfChange(book, event.target.value)}>
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

export default Bookshelf
