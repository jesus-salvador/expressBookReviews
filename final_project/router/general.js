const { response } = require('express');
const express = require('express');
const Books = require("../models/books.js");
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
public_users.get('/', (req, res) => {
  return res.send(JSON.stringify(Books.getAll()));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  let result = [];

  const book = Books.getByISBN(isbn);
  if (book)
    result.push(book)

  return res.send(result);
});

// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  let result = [];

  const book = Books.find({author});
  if (book)
    result.push(book)

  return res.send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = [];

  const book = Books.find({title});
  if (book)
    result.push(book)

  return res.send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = Books.getByISBN(isbn);

  reviews = book?.reviews ? [book.reviews] : [];
  return res.send(reviews);
});

module.exports.general = public_users;
