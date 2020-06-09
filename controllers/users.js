"use strict";

module.exports = function (_, passport, User) {
  return {
    SetRouting: function (router) {
      router.get("/", this.indexPage);
      router.get("/signup", this.getSignUp);
      router.get("/home", this.homePage);

      router.post("/", User.LoginValidation, this.postLogin);
      router.post("/signup", User.SignUpValidation, this.postSignUp);
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
