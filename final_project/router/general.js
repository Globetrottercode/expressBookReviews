const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");

const doesExist = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });
  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
};
public_users.post("/register", (req, res) => {
  console.log("hello");
  const username = req.body.username;
  const password = req.body.password;
  if (username && password) {
    if (!doesExist(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registred. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  const myBooks = new Promise((resolve, reject) => {
    resolve(books);
  });
  myBooks
    .then((resBooks) => {
      res.send(resBooks);
    })
    .catch((err) => {
      console.log(err);
    });
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbnBook = new Promise((resolve, reject) => {
    const ISBN = req.params.isbn;
    for (const isbn in books) {
      if (isbn === ISBN) {
        resolve(books[ISBN]);
      }
    }
    reject("ISBN not found");
  });
  isbnBook
    .then((resBook) => {
      res.send(resBook);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const authorBook = new Promise((resolve, reject) => {
    const AUTHOR = req.params.author;
    for (const isbn in books) {
      if (books[isbn]["author"] === AUTHOR) {
        resolve(books[isbn]);
      }
    }
    reject("Author not found");
  });
  authorBook
    .then((resBook) => {
      res.send(resBook);
    })
    .catch((err) => {
      console.log(err);
      res.send(err);
    });

  // console.log(books[email])
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const titleBooks = new Promise((resolve, reject) => {
    const TITLE = req.params.title;
    for (const isbn in books) {
      if (books[isbn]["title"] === TITLE) {
        resolve(books[isbn]);
      }
    }
    reject("Title not found");
  });
  titleBooks
    .then((resBook) => {
      res.send(resBook);
    })
    .catch((err) => {
      res.send(err);
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const ISBN = req.params.isbn;
  for (const isbn in books) {
    if (isbn === ISBN) {
      res.send(books[isbn]["reviews"]);
    }
  }
});

module.exports.general = public_users;
