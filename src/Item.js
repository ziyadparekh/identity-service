"use strict";

var connection = require("../helpers/connection"),
    _ = require('underscore');

function Item (payload) {
    var data = (payload && payload.attributes);
    this.attributes = data ? payload.attributes : {};
}

Item.prototype.setNewValues = function (payload) {
    _.defaults(this.attributes, payload);
};

Item.prototype.toJSON = function () {
    return this.attributes;
};

Item.prototype.createNewItem = function (done, next) {
    var post = {};
    _.map(this.attributes, function (val, key) {
        if (typeof val === 'object') post[key] = JSON.stringify(val);
        else post[key] = val;
    });
    connection.query("INSERT INTO closet_items SET ?", post, function (err, rows) {
        if (err) return done(err, null);
        return done(null, rows);
    }, next);
};


module.exports = Item;