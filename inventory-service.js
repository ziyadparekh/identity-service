"use strict";

var express = require('express'),
    errorHandler = require('errorHandler'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    multer = require('multer'),
    path = require('path'),
    upload,
    app;


var ItemRoutes = require('./routes/ItemRoutes');

// for parsing multipart/form-data
upload = multer();

app = express();

process.on("uncaughtException", function (err) {
    console.log(err);
    process.exit(0);
});

// Set up middleware
app.use(errorHandler({ "showStack": true }));
// Dont parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ "extended": false }));
// Accept json
app.use(bodyParser.json());

// Logging
app.use(morgan("combined"));

// Routes
app.use("/api", ItemRoutes);

module.exports = app;


