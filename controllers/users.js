"use strict";
const { body, validationResult } = require("express-validator");

module.exports = function (_, passport, User) {
  return {
    SetRouting: function (router) {
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("/auth/facebook", this.getFacebookLogin);
      router.get("/auth/facebook/callback", this.facebookLogin);
      router.get("/auth/google", this.getGoogleLogin);
      router.get("/auth/google/callback", this.googleLogin);

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
    getFacebookLogin: passport.authenticate("facebook", {
      scope: "email",
    }),
    facebookLogin: passport.authenticate("facebook", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true,
    }),
    getGoogleLogin: passport.authenticate("google", {
      scope:
        "https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    }),
    googleLogin: passport.authenticate("google", {
      successRedirect: "/home",
      failureRedirect: "/signup",
      failureFlash: true,
    }),
  };
};
