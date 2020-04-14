require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");

const { NODE_ENV } = require("../config/config");
//const PURCHASES = require("../seeds/purchaseSeed.json");
const authRouter = require("./auth-router");
const purchaseRouter = require("./purchase-router");
const usersRouter = require("./users-router");
const groupsRouter = require("./groups-router");

const app = express();

const morganOption = process.env.NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());
app.use(express.json());

//* VALIDATION *//

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

// process the login form
app.use("/api/auth", authRouter);

app.use("/api/purchases", purchaseRouter);

app.use("/api/users", usersRouter);

app.use("/api/groups", groupsRouter);

app.use("/api/auth/signin", authRouter);

//Create new group

// =====================================
// Home GROUP SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)

// =====================================
// LOGOUT ==============================
// =====================================
app.get("/api/signout", function (req, res) {
  req.logout();
  res.redirect("/signin");
});

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

module.exports = app;
