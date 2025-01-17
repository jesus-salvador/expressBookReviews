const express = require('express')
const jwt = require('jsonwebtoken')
const Books = require('../models/books.js')
const registeredUsers = express.Router()

const users = []

const isValid = (username) => { // returns boolean
  const userWithSameName = users.find((user) => {
    return user.username === username
  })

  if (userWithSameName) { return false }

  return true
}

const authenticatedUser = (username, password) => {
  const registeredUser = users.find((user) => {
    return user.username === username && user.password === password
  })

  return registeredUser !== undefined
}

// only registered users can login
registeredUsers.post('/login', (req, res) => {
  const username = req.body.username
  const password = req.body.password
  if (!username || !password) { return res.status(404).json({ message: 'Empty username or password' }) }

  if (!authenticatedUser(username, password)) { return res.status(404).json({ message: 'Invalid username and/or password' }) }

  const accessToken = jwt.sign({
    data: { username }
  }, 'access', { expiresIn: 60 * 60 })

  req.session.authorization = {
    accessToken
  }
  return res.status(200).send('User successfully logged in')
})

// Add a book review
registeredUsers.put('/auth/review/:isbn', (req, res) => {
  const username = req.user.username
  const isbn = req.params.isbn
  const review = req.body.review
  const book = Books.getByISBN(isbn)

  if (!book) { return res.status(404).json({ message: 'Book not found!' }) }

  if (book.reviews[`r-${username}`]) {
    res.status(200).json({ message: 'Success review updated' })
  } else {
    res.status(201).json({ message: 'Success review created' })
  }

  book.reviews[username] = review

  return res
})

// delete a book review
registeredUsers.delete('/auth/review/:isbn', (req, res) => {
  const username = req.user.username
  const isbn = req.params.isbn
  const book = Books.getByISBN(isbn)

  if (!book) { return res.status(404).json({ message: 'Book not found!' }) }

  if (book.reviews[username]) {
    delete book.reviews[username]
    res.status(204).json({ message: 'Success review deleted' })
  } else {
    res.status(404).json({ message: 'Review not found!' })
  }

  return res
})

module.exports.authenticated = registeredUsers
module.exports.isValid = isValid
module.exports.users = users
