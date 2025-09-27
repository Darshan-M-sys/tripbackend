const express = require('express');
const authRouter = express.Router();
const User = require('../models/authModel');
const bcrypt = require('bcryptjs');

// Register
authRouter.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ msg: "User already exists!" });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: hashPassword });
    await newUser.save();

    res.json({ msg: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ msg: "Invalid password" });

    // Set session
    req.session.userId = user._id;
    req.session.username = user.username;
    req.session.email = user.email;

    // Save session before responding
    req.session.save(err => {
      if (err) return res.status(500).json({ msg: "Session save failed" });
      res.json({ msg: "Login successful" });
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Get current user
authRouter.get('/', async (req, res) => {
  try {
    if (!req.session.userId) return res.json({ msg: "Login required" });
    res.json({
      msg: "Authenticated",
      username: req.session.username,
      email: req.session.email
    });
  } catch (error) {
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Logout
authRouter.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ success: false, message: "Logout failed" });
    res.clearCookie('connect.sid', { path: '/' });
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = authRouter;
