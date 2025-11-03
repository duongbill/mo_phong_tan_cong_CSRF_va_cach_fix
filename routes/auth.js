const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { isNotAuthenticated } = require("../middleware/auth");

// Login page
router.get("/login", isNotAuthenticated, (req, res) => {
  res.render("auth/login", {
    title: "Login",
    error: req.flash("error"),
  });
});

// Register page
router.get("/register", isNotAuthenticated, (req, res) => {
  res.render("auth/register", {
    title: "Register",
    error: req.flash("error"),
  });
});

// Login process
router.post("/login", isNotAuthenticated, async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await user.comparePassword(password))) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/auth/login");
    }

    req.session.isValid = true;
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/");
  } catch (err) {
    console.error("Login error:", err);
    req.flash("error", "An error occurred during login");
    res.redirect("/auth/login");
  }
});

// Register process
router.post("/register", isNotAuthenticated, async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      req.flash("error", "Passwords do not match");
      return res.redirect("/auth/register");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      req.flash("error", "Username or email already exists");
      return res.redirect("/auth/register");
    }

    const user = await User.create({
      username,
      email,
      password,
    });

    req.session.isValid = true;
    req.session.userId = user._id;
    req.session.username = user.username;
    res.redirect("/");
  } catch (err) {
    console.error("Registration error:", err);
    req.flash("error", "An error occurred during registration");
    res.redirect("/auth/register");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
