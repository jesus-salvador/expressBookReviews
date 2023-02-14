const express = require('express');
const Books = require("../models/books.js");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username
  const password = req.body.password

  if (username && password) {
    if (isValid(username)) {
      users.push({
        "username": username,
        "password": password
      });
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  const books = await AsyncBooks.getAll()
  return res.send(JSON.stringify(books));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
  const isbn = req.params.isbn;
  let result = [];

  const book = await AsyncBooks.getByISBN(isbn)
  if (book)
    result.push(book)

  return res.send(result);
});

// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
  const author = req.params.author;
  let result = [];

  const book = await AsyncBooks.find({author});
  if (book)
    result.push(book)

  return res.send(result);
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  let result = [];

  const book = await AsyncBooks.find({title});
  if (book)
    result.push(book)

  return res.send(result);
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Books.getByISBN(isbn);

  reviews = book?.reviews ? [book.reviews] : [];
  return res.send(reviews);
});


class AsyncBooks {
  static getAll() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(books)
      }, 500);
    });
  }

  static getByISBN(isbn) {
    let book;
    for (const key in books) {
      if (key === isbn) {
        book = [books[key]];
        break;
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(book)
      }, 500);
    });
  }

  static find(filters) {
    let book;
    for (const key in books) {

      let hasAllFilters = true;
      for (const filter in filters){
        if (books[key][filter] === filters[filter]) {
          continue;
        } else {
          hasAllFilters = false;
          break;
        }
      }

      if (hasAllFilters) {
        book = books[key];
        break;
      }
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(book)
      }, 500);
    });
  }
}

module.exports.general = public_users;
