"use strict";

var UserDatabase = require("../database/UserDatabase"),
    helpers = require("../helpers/helpers"),
    _ = require("underscore");

var User = {};

User.updateUser = function (req, res) {

};

User.getUserByToken = function (req, res) {
  var user_token = req.user_token;

  // Enter the promised land
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
  var user_id = req.user_id;

  UserDatabase.getUserById(user_id)
    .then(function (user) {
      return helpers.safeUserResponse(user, true);
    }).then(function (safe_user) {
      return helpers.parse(safe_user);
    }).then(function (parsed_user) {
      return res.status(200).json({"user" : parsed_user}).end();
    }).catch(function (err) {
      return res.status(403).json({"message": err.message}).end();
    });
};

User.registerNewUser = function (req, res) {
    var user = req.user;

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
  var user = req.user;

  UserDatabase.getUserByEmail(user.email)
    .then(function (user_data) {
      return helpers.authorizeUser(user_data, user.password)
    }).then(function (new_user) {
      return helpers.safeUserResponse(new_user, false);
    }).then(function (safe_user) {
      return helpers.parse(safe_user);
    }).then(function (parsed_user) {
      return res.status(200).json({"user" : parsed_user}).end();
    }).catch(function (err) {
      return res.status(403).json({"message": err.message}).end();
    });
};

module.exports = User;