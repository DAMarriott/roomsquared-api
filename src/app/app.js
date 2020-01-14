require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV } = require("../config/config");
const { CLIENT_ORIGIN } = require("../config/config");
const PURCHASES = require('../seeds/purchaseSeed.json')

console.log(process.env.API_TOKEN)

const app = express();

const morganOption = NODE_ENV === "production";

app.use(morgan(morganOption));
app.use(helmet());
app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

//* VALIDATION *//

app.use(function validateBearerToken(req, res, next) {
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get('Authorization')
  if (!authtoken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({error: "Unauthorized request"});
  }
  next()
});

//* ROUTES *//

// =====================================
// HOME PAGE (with login links) ========
// =====================================
app.get("/", (req, res) => {
  const responseText = `Here are some details of your request:
  Base URL: ${req.baseUrl}
  Host: ${req.hostname}
  Path: ${req.path}
`;
  res.send(responseText);
});

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get("/signin", (req, res) => {
  const responseText = `Here are some details of your request:
  Base URL: ${req.baseUrl}
  Host: ${req.hostname}
  Path: ${req.path}
`;
  res.send(responseText);
});

// process the login form
app.post("/signin");

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
app.get("/signup", (req, res) => {
  // render the page and pass in any flash data if it exists
  res.render("signup");
});

// process the signup form
app.post("/signup");

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get("/home", isLoggedIn, (req, res) => {
  let response = PURCHASES;
  if (req.query.userOne) {
    response = response.userOne;
  }
  if (req.query.userTwo) {
    response = response.userTwo;
  }
  if (req.query.userThree) {
    response = response.userThree
  }
  res.json(response)
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get("/signout", function(req, res) {
  req.logout();
  res.redirect("/signin");
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) return next();

  // if they aren't redirect them to the home page
  res.redirect("/");
}

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "production") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

var port = process.env.PORT || 8000;

app.listen(port);
