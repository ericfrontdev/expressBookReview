const express = require("express")
const jwt = require("jsonwebtoken")
let books = require("./booksdb.js")
const regd_users = express.Router()

let users = []

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username
  })
  if (userswithsamename.length > 0) {
    return true
  } else {
    return false
  }
}

const authenticatedUser = (username, password) => {
  let validusers = users.filter((user) => {
    return user.username === username && user.password === password
  })
  if (validusers.length > 0) {
    return true
  } else {
    return false
  }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password

  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" })
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign(
      {
        data: password,
      },
      "access",
      { expiresIn: 60 * 60 }
    )

    req.session.authorization = {
      accessToken,
      username,
    }
    return res.status(200).send("User successfully logged in")
  } else {
    return res
      .status(208)
      .json({ message: "Invalid Login. Check username and password" })
  }
})

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.username
  const isbn = req.params.isbn
  const review = req.query.review
  console.log(username)
  if (!review) {
    return res.status(400).json({ message: "Please provide a review" })
  }
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" })
  }
  if (!books[isbn].reviews) {
    books[isbn].reviews = {}
  }
  if (books[isbn].reviews[username]) {
    books[isbn].reviews[username] = review
    return res.json({ message: "Review modified successfully" })
  }
  books[isbn].reviews[username] = review
  return res.json({ message: "Review added successfully" })
})

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn
  let reviewer = req.session.authorization["username"]
  let filtered_review = books[isbn]["reviews"]
  if (filtered_review[reviewer]) {
    delete filtered_review[reviewer]
    res.send(
      `Reviews for the ISBN  ${isbn} posted by the user ${reviewer} deleted.`
    )
  } else {
    res.send(`Can't delete, as this review has been posted by ${reviewer}`)
  }
})

module.exports.authenticated = regd_users
module.exports.isValid = isValid
module.exports.users = users
