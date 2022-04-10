const express = require("express");
const passport = require("passport");
const router = express.Router();
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register");
});

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to DaviScout!");
      res.redirect("/restaurants");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("register");
  }
});

router.get("/login", (req, res) => {
  res.render("users/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/restaurants";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success", "Successfully logged out.");
  res.redirect("/restaurants");
});

module.exports = router;
