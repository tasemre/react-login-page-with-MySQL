const express = require("express"); // import express
const app = express(); // create express app
const path = require("path"); // import path
const mysql = require("mysql"); // import mysql
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session); // import express-mysql-session
const Router = require("./Router"); // import Router.js
app.use(express.static(path.join(__dirname, "build")));
app.use(express.json());

// Database
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "myapp",
});

db.connect(function (err) {
  if (err) {
    console.log("DB error");
    throw err;
    return false;
  }
});

const sessionStore = new MySQLStore(
  {
    expiration: 1825 * 86400 * 1000, // 5 years in milliseconds
    endConnectionOnClose: false, // keep connection open
  },
  db // connection
);
app.use(
  session({
    key: "kjdfnsdngfkjsdnfgjsdnfg365654sdfg5sdfgd", // random key
    secret: "sdlkfskdjngfsdfgds5gfds4gf56sd4gf8654", // random secret
    store: sessionStore, // store session in database
    resave: false, // don't resave if nothing changed
    saveUninitialized: false, // don't save empty values
    cookie: {
      // cookie settings
      maxAge: 1825 * 86400 * 1000, // 5 years in milliseconds
      httpOnly: false, // allow front-end to access cookie
    },
  })
);

new Router(app, db);

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(3000);
