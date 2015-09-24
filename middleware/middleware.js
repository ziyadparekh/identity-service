"use strict";

var mkDeferred = require("../helpers/deferred");

exports.validateToken = function (req, res, next) {
    var def = mkDeferred();
    def.resolve();
    //return def.getPromise();
    next();
};