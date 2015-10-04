"use strict";

var mkDeferred = require("../helpers/deferred");
var copy = require("../helpers/copy");
var _ = require("underscore");
var helpers = require("../helpers/helpers");

exports.validateToken = function (req, res, next) {
  var def = mkDeferred();
  def.resolve();
  next();
};

exports.validateTokenRequest = function (req, res, next) {
  var user_token = req.query.user_token;
  if (!user_token) {
    return res.status(403).json({"message": copy.ERR_MISSING_USER_TOKEN}).end();
  }
  req.user_token = user_token;
  next();
};

exports.validateUserId = function (req, res, next) {
  var user_id = Number(req.params.user_id) || Number(req.body.user_id);

  if (!user_id || !_.isNumber(user_id)) {
    return res.status(403).json({"message": copy.ERR_INVALID_USER_ID}).end();
  }
  req.user_id = user_id;
  next();
};

exports.validateNewUserRequest = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var user = {};

  if (!email || !helpers.validateEmail(email)){
    return res.status(403).json({"message": copy.ERR_MISSING_EMAIL}).end();
  }
  if (!password || !helpers.validatePassword(password)) {
    return res.status(403).json({"message": copy.ERR_MISSING_PASSWORD}).end();
  }
  user.user_password = password;
  user.user_email = email;
  req.user = user;
  next();
};

exports.validateLoginRequest = function (req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var user = {};

  if (!email || !helpers.validateEmail(email)){
    return res.status(403).json({"message": copy.ERR_MISSING_EMAIL}).end();
  }
  if (!password || !helpers.validatePassword(password)) {
    return res.status(403).json({"message": copy.ERR_MISSING_PASSWORD}).end();
  }

  user.password = password;
  user.email = email;
  req.user = user;
  next();
};