"use strict";

var _ = require('underscore');
var Backbone = require('backbone');

var Item = Backbone.Model.extend({
    defaults: {
        "name": false,
        "images": [],
        "description": false
    },
    parse: function (payload) {
        payload = payload || {};
        return payload;
    },
    newItem: function () {
        console.log(this.toJSON());
    }
});

module.exports = Item;