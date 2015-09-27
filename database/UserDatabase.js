"use strict";

var connection = require("../helpers/connection"),
  mkDeffered = require("../helpers/deferred"),
  queries = require("../helpers/queries"),
  UserDatabase = {};


UserDatabase.createNewUser = function (post) {
  var def = mkDeffered();
  connection.query(queries.createUserQuery(), post, function (err, rows) {
    if (err) {
      def.reject(err);
    } else {
      def.resolve(rows.insertId);
    }
  });
  return def.getPromise();
};

UserDatabase.getUserByToken = function (user_token) {
  var def = mkDeffered();
  connection.query(queries.getUserByToken(), user_token, function (err, rows) {
    if (err || !rows.length) {
      def.reject({"message" : "user not found"});
    } else {
      def.resolve(rows[0]);
    }
  });
  return def.getPromise();
};

UserDatabase.getUserById = function (row_id) {
  var def = mkDeffered();
  connection.query(queries.getUserById(), row_id, function (err, rows) {
    if (err || !rows.length) {
      def.reject({"message" : "user not found"});
    } else {
      def.resolve(rows[0]);
    }
  });
  return def.getPromise();
};

UserDatabase.getUserByEmail = function (email) {
  var def = mkDeffered();
  connection.query(queries.getUserByEmail(), email, function (err, rows) {
    if (err) {
      def.reject(err);
    } else {
      def.resolve(rows[0]);
    }
  });
  return def.getPromise();
};

module.exports = UserDatabase;