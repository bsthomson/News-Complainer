const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const db = require('./models');

const PORT = 3000;

const app = express();

app.use(logger("dev"));

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

mongoose.connect('mongodb://localhost/newsComplainer');

app.listen(PORT, function () {
  console.log('App running on port' + PORT + "!");
});