const books = require('../router/booksdb.js')

class Books {
  static getAll () {
    return books
  }

  static getByISBN (isbn) {
    let book
    for (const key in books) {
      if (key === isbn) {
        book = [books[key]]
        break
      }
    }
    return book
  }

  static find (filters) {
    let book
    for (const key in books) {
      let hasAllFilters = true
      for (const filter in filters) {
        if (books[key][filter] === filters[filter]) {
          continue
        } else {
          hasAllFilters = false
          break
        }
      }

      if (hasAllFilters) {
        book = books[key]
        break
      }
    }
    return book
  }
}

module.exports = Books
