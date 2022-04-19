const User = require("../models/user");

module.exports = {
  registerForm: (req, res) => {
    res.render("users/register");
  },

  register: async (req, res) => {
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
  },

  loginForm: (req, res) => {
    res.render("users/login");
  },

  login: (req, res) => {
    req.flash("success", "Welcome Back!");
    const redirectUrl = req.session.returnTo || "/restaurants";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  },

  logout: (req, res) => {
    req.logout();
    req.flash("success", "Successfully logged out.");
    res.redirect("/restaurants");
  },
};
