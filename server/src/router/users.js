const express = require("express");
const userRouter = express.Router();
const JWT = require("jsonwebtoken");
const passport = require("passport");
const passportConfig = require("../config/passport");
const User = require("../models/users")

//Register
userRouter.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        message: { msgBody: "Username, email, and password are required.", msgError: true },
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: { msgBody: "Email is already in use.", msgError: true },
      });
    }

    // Create a new user
    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json({
      message: { msgBody: "Account created successfully.", msgError: false },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: { msgBody: "An error occurred while creating the account.", msgError: true },
    });
  }
});

//Login
const signToken = (userID) => {
  try {
    return JWT.sign({
      iss: "ThanhTien",
      sub: userID,
    }, 
    "ThanhTien", 
    { expiresIn: "1d" });
  } catch (err) {
    console.error("Error signing token", err);
    throw new Error('Error signing token');
  }
};

userRouter.post("/login", passport.authenticate("local", { session: false }), (req, res) => {
  if (req.isAuthenticated()) {
    const { _id, email, username, phone, address } = req.user;
    const token = signToken(_id);
    res.cookie('access_token', token, { httpOnly: true, sameSite: 'Lax', secure: true });
    return res.status(200).json({
      isAuthenticated: true,
      user: { _id, email, username, phone, address },
    });
  }

  return res.status(401).json({
    isAuthenticated: false,
    message: "Invalid credentials or user not found.",
  });
});

//Logout
userRouter.get("/logout", passport.authenticate("jwt", { session: false }), (req, res) => {
  res.clearCookie("access_token");
  res.json({user: {email: "", username: "", phone: "", address: ""}, session: true});
});

// Check login
userRouter.get("/authenticated", passport.authenticate("jwt", { session: false }), (req, res) => {
  const { _id, email } = req.user;
  res.status(200).json({
    isAuthenticated: true,
    user: { _id, email, username: req.user.username, phone: req.user.phone, address: req.user.address },
  });
});

module.exports = userRouter;