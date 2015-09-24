"use strict";

var connection = require("../helpers/connection"),
    mkDeferred = require("../helpers/deferred"),
    ItemDatabase = require("../database/ItemDatabase"),
    _ = require('underscore'),
    Item = {};

Item.createNewItem = function (req, res, next) {
    var post = req.body.item;
    var itemPost = this._formatItem(post);

    ItemDatabase.insertNewItem(req, res, next)
        .then(function (result) {
            return res.status(200).json({"item" : result}).end();
        }).catch(function (err) {
            return res.status(403).json({"message" : err.message}).end();
        });
};

Item._formatItem = function (post) {
    return post;
};

module.exports = Item;