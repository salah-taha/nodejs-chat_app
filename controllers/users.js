"use strict";
const { body, validationResult } = require("express-validator");

module.exports = function (_, passport, User) {
  return {
    SetRouting: function (router) {
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("/home", this.homePage);

      router.post(
        "/",
        [
          body("email", "enter a correct email").isEmail(),
          body("password", "Password must be 6 characters at least").isLength({
            min: 6,
          }),
        ],
        this.postValidation,
        this.postLogin
      );
      router.post(
        "/signup",
        [
          body("email", "enter a correct email").isEmail(),
          body("username", "username must be 5 characters at least").isLength({
            min: 5,
          }),
          body("password", "Password must be 6 characters at least").isLength({
            min: 6,
          }),
        ],
        this.postValidation,
        this.postSignUp
      );
      //   router.post("/signup", User.SignUpValidation, this.postSignUp);
    },
    indexPage: function (req, res) {
      const errors = req.flash("error");

      return res.render("index", {
        title: "Footballkk | login",
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },
    homePage: function (req, res) {
      return res.render("home");
    },
    getSignUp: function (req, res) {
      const errors = req.flash("error");
      return res.render("signup", {
        title: "Footballkk | SignUp",
        messages: errors,
        hasErrors: errors.length > 0,
      });
    },
    postValidation: function (req, res, next) {
      const reqErrors = validationResult(req).errors;
      const errors = reqErrors.filter((e) => {
        if (e.msg == "Missing credentials" || e.msg == "Invalid value") {
          return false;
        }
        return true;
      });
      if (errors.length > 0) {
        const messages = [];
        errors.forEach((error) => {
          messages.push(error.msg);
        });
        req.flash("error", messages);
        return res.redirect(req.url);
      }
      return next();
    },
    postSignUp: passport.authenticate("local.signup", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true,
    }),
    postLogin: passport.authenticate("local.login", {
      successRedirect: "/home",
      failureRedirect: "/",
      failureFlash: true,
    }),
  };
};
