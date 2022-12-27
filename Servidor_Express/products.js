const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const app = express();

app.use(helmet())

app.use(cors())

app.use(morgan("combined"))

app.use('/user' , require('./routes/user.route'));

module.exports = app;