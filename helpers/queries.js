"use strict";

exports.insertItemQuery = function () {
  return ["INSERT INTO closet_items SET ?"].join("");
};

exports.createUserQuery = function () {
  return ["INSERT INTO closet_users SET ?"].join("");
};

exports.getUserById = function () {
  return ["SELECT * FROM closet_users WHERE id = ?"].join("");
};

exports.getUserByEmail = function () {
  return ["SELECT * FROM closet_users WHERE user_email = ?"].join("");
};

exports.getUserByToken = function () {
  return ["SELECT * FROM closet_users WHERE user_token = ?"].join("");
};