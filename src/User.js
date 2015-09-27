"use strict";

var UserDatabase = require("../database/UserDatabase"),
    helpers = require("../helpers/helpers"),
    _ = require("underscore"),
    ERR_MISSING_EMAIL = "A valid email address is required",
    ERR_MISSING_PASSWORD = "A valid password is required",
    ERR_INVALID_USER_ID = "A valid user id is required",
    ERR_MISSING_USER_TOKEN = "A valid user token is required";

var User = {};

User.getUserByToken = function (req, res) {
  var user_token = req.query.user_token;

  if (!user_token) {
    return res.status(403).json({"message": ERR_MISSING_USER_TOKEN}).end();
  }

  UserDatabase.getUserByToken(user_token)
    .then(function (user) {
      return helpers.safeUserResponse(user);
    }).then(function (safe_user) {
      return helpers.parse(safe_user);
    }).then(function (parsed_user) {
      return res.status(200).json({"user" : parsed_user}).end();
    }).catch(function (err) {
      return res.status(403).json({"message": err.message}).end();
    });
};

User.getUserById = function (req, res) {
  var user_id = Number(req.params.user_id) || Number(req.body.user_id);

  if (!user_id || !_.isNumber(user_id)) {
    return res.status(403).json({"message": ERR_INVALID_USER_ID}).end();
  }

  UserDatabase.getUserById(user_id)
    .then(function (user) {
      return helpers.safeUserResponse(user);
    }).then(function (safe_user) {
      return helpers.parse(safe_user);
    }).then(function (parsed_user) {
      return res.status(200).json({"user" : parsed_user}).end();
    }).catch(function (err) {
      return res.status(403).json({"message": err.message}).end();
    });
};

User.registerNewUser = function (req, res) {
    var email = req.body.email,
      password = req.body.password,
      user = {};

    if (!email || !helpers.validateEmail(email)){
        return res.status(403).json({"message": ERR_MISSING_EMAIL});
    }
    if (!password || !helpers.validatePassword(password)) {
        return res.status(403).json({"message": ERR_MISSING_PASSWORD});
    }

    user.user_password = password;
    user.user_email = email;

    helpers.formatUser(user)
      .then(function (user_data) {
        return UserDatabase.createNewUser(user_data);
      }).then(function (insert_id) {
        return UserDatabase.getUserById(insert_id);
      }).then(function (new_user) {
        return helpers.parse(new_user);
      }).then(function (parsed_user) {
        return res.status(200).json({"user" : parsed_user}).end();
      }).catch(function (err) {
        return res.status(403).json({"message": err.message}).end();
      });
};

User.loginUser = function (req, res, next) {
  var email = req.body.email,
    password = req.body.password;

  if (!email || !helpers.validateEmail(email)){
    return res.status(403).json({"message": ERR_MISSING_EMAIL});
  }
  if (!password || !helpers.validatePassword(password)) {
    return res.status(403).json({"message": ERR_MISSING_PASSWORD});
  }

  UserDatabase.getUserByEmail(email)
    .then(function (user) {
      return helpers.authorizeUser(user, password)
    }).then(function (new_user) {
      return helpers.parse(new_user);
    }).then(function (parsed_user) {
      return res.status(200).json({"user" : parsed_user}).end();
    }).catch(function (err) {
      return res.status(403).json({"message": err.message}).end();
    });
};

module.exports = User;