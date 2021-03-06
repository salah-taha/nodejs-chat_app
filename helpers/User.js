"use strict";

const { body, validationResult } = require("express-validator");

module.exports = function () {
  return {
    SignUpValidation: (req, res, next) => {
      req.checkBody("username", "Username less than 5").isLength({ min: 5 });
      req.checkBody("email", "Email is invalid").isEmail();
      req.checkBody("password", "Username less than 5").isLength({ min: 5 });
      req
        .getValidationResult()
        .then((result) => {
          const errors = result.array();
          const messages = [];
          errors.forEach((error) => {
            messages.push(error.msg);
          });
          req.flash("error", messages);
          res.redirect("/signup");
        })
        .catch((err) => {
          return next();
        });
    },
    LoginValidation: (req, res, next) => {
      req.checkBody("email", "Email is invalid").isEmail();
      req.checkBody("password", "password less than 5").isLength({ min: 5 });
      req
        .getValidationResult()
        .then((result) => {
          const errors = result.array();
          const messages = [];
          errors.forEach((error) => {
            messages.push(error.msg);
          });
          req.flash("error", messages);
          res.redirect("/");
        })
        .catch((err) => {
          return next();
        });
    },
  };
};
