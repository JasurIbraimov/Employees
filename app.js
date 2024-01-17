const express = require("express");
const logger = require("morgan");

require("dotenv").config(); // Setup env

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/user", require("./routes/users"));

module.exports = app;
