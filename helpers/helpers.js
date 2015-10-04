"use strict";

var crypto = require("crypto");
var moment = require("moment");
var mkDeferred = require("../helpers/deferred");
var UserModel = require("../helpers/models").defaultUserModel;
var _ = require("underscore");

var EMAIL_REGEX_PATTERN = "^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_"
                        + "]+)*\.(aero|arpa|biz|com|coop|edu|gov|info|int|mil|museum|name|net|org|pro|travel|mobi|[a-z"
                        + "][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$";

var INCORRECT_PASSWORD_MESSAGE = "Password supplied is incorrect";


var sha256 = function (string) {
  return crypto.createHash('sha256').update(string).digest("hex");
};

var rand = function (size) {
  var def = mkDeferred();
  crypto.randomBytes(size, function (ex, buf) {
    if (ex) {
      def.reject(ex);
    } else {
      def.resolve(buf.toString('hex'));
    }
  });
  return def.getPromise();
};

var stringify = function (obj) {
  var o = {};
  _.each(obj, function (val, key) {
    if (typeof val === "object") {
      o[key] = JSON.stringify(val);
    } else {
      o[key] = val;
    }
  });
  return o;
};

var _parse = function (obj) {
  var o = {};
  _.each(obj, function (val, key) {
    try {
      o[key] = JSON.parse(val);
    } catch (e) {
      o[key] = val;
    }
  });
  return o;
};

var parse = function (obj) {
  var def = mkDeferred();
  var parsed = _parse(obj);
  def.resolve(parsed);
  return def.getPromise();
};

var _formatUser = function (user, token, hashed) {
  var obj = {
    "user_token": token,
    "user_hashed": hashed,
    "user_active": "Y",
    "user_created": moment().format("YYYY-MM-DD HH:mm:ss"),
    "user_modified": moment().format("YYYY-MM-DD HH:mm:ss")
  };
  var user_data = _.extend(UserModel, user, obj);
  delete user_data.user_password;

  return stringify(user_data);
};

var validateEmail = function (email) {
  var regex = new RegExp(EMAIL_REGEX_PATTERN);
  return email.match(regex);
};

var validatePassword = function (password) {
  return (password && password.length > 6);
};

var formatUser = function (user) {
  var def = mkDeferred();
  var hashed = sha256(user.user_password);

  rand(32)
    .then(function (token) {
      return _formatUser(user, token, hashed);
    }).then(function (user_data) {
      def.resolve(user_data);
    }).catch(function (err) {
      def.reject(err);
    });

  return def.getPromise();
};

var authorizeUser = function (user, password) {
  var def = mkDeferred();
  var hashed = sha256(password);

  if (user.user_hashed === hashed) {
    def.resolve(user);
  } else {
    def.reject({"message": INCORRECT_PASSWORD_MESSAGE});
  }
  return def.getPromise();
};

var _cleanUpUser = function (user, full) {
  delete user.user_hashed;
  if (full)
    delete user.user_token;
  for (var i in user) {
    if (user.hasOwnProperty(i)) {
      if (_.isNull(user[i]) || _.isUndefined(user[i])) {
        delete user[i];
      }
    }
  }
  return user;
};

var safeUserResponse = function (user) {
  var def = mkDeferred();
  user = _cleanUpUser(user);
  def.resolve(user);

  return def.getPromise();
};

module.exports = {
  formatUser: formatUser,
  validatePassword: validatePassword,
  validateEmail: validateEmail,
  stringify: stringify,
  parse: parse,
  authorizeUser: authorizeUser,
  safeUserResponse: safeUserResponse
};