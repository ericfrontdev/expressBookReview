const express = require("express")
let books = require("./booksdb.js")
let isValid = require("./auth_users.js").isValid
let users = require("./auth_users.js").users
const public_users = express.Router()
const axios = require("axios")

public_users.post("/register", (req, res) => {
  const username = req.body.username
  const password = req.body.password
  console.log(username, password)
  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password })
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" })
    } else {
      return res.status(404).json({ message: "User already exists!" })
    }
  }
  return res.status(404).json({ message: "Unable to register user." })
})

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4))
})

//Get the book list using Promises with Axios
public_users.get("/api/booksPromise/", function (req, res) {
  axios
    .get("http://localhost:3000")
    .then(function (response) {
      return res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error)
      return res
        .status(500)
        .json({ message: "There was a error fetching the book list." })
    })
})

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn
  if (books[isbn]) {
    return res.json(books[isbn])
  } else {
    return res.status(404).json({ message: "Book not found" })
  }
})

//Get book by ISBN using Promises with Axios
public_users.get("/api/booksPromise/isbn/:isbn", function (req, res) {
  let { isbn } = req.params
  axios
    .get(`http://localhost:3000/isbn/${isbn}`)
    .then(function (response) {
      console.log(response.data)
      return res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error)
      return res
        .status(500)
        .json({ message: "There was a error fetching book details." })
    })
})

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author
  let bookAuthors = []
  for (const book in books) {
    if (books[book].author === author) {
      bookAuthors.push(books[book])
    }
  }
  if (bookAuthors.length > 0) {
    res.send(bookAuthors)
  } else {
    res.status(404).send("No books found for this author")
  }
})

//Get book by author using Promises with Axios
public_users.get("/api/booksPromise/author/:author", function (req, res) {
  let { author } = req.params
  axios
    .get(`http://localhost:3000/author/${author}`)
    .then(function (response) {
      console.log(response.data)
      return res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error)
      return res
        .status(500)
        .json({ message: "There was a error fetching book details." })
    })
})

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title
  let bookTitles = []
  for (const book in books) {
    if (books[book].title === title) {
      bookTitles.push(books[book])
    }
  }
  if (bookTitles.length > 0) {
    res.send(bookTitles)
  } else {
    res.status(404).send("No books found for this title")
  }
})

//Get book by title using Promises with Axios
public_users.get("/api/booksPromise/title/:title", function (req, res) {
  let { title } = req.params
  axios
    .get(`http://localhost:3000/title/${title}`)
    .then(function (response) {
      console.log(response.data)
      return res.status(200).json(response.data)
    })
    .catch(function (error) {
      console.log(error)
      return res
        .status(500)
        .json({ message: "There was a error fetching book details." })
    })
})

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn
  if (!books[isbn]) {
    return res.status(404).json({ message: "No book found" })
  }
  const reviews = books[isbn].reviews
  return res.status(200).json({ reviews: reviews })
})

module.exports.general = public_users
