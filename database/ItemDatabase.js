"use strict";

var connection = require("../helpers/connection"),
    mkDeffered = require("../helpers/deferred"),
    queries = require("../helpers/queries"),
    ItemDatabase = {};

ItemDatabase.insertNewItem = function (req, res, next) {
    var def = mkDeffered();
    connection.query(queries.insertItemQuery(), req.post, function (err,rows) {
        if (err) {
            def.reject(err);
        } else {
            def.resolve(rows[0]);
        }
    });
    return def.getPromise();
};