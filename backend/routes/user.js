const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
  const { username, email, password } = req.body;

  bcrypt.hash(password, 10).then((hash) => {
    const user = new User({
      username: username,
      email: email,
      password: hash,
    });

    user
      .save()
      .then((result) => {
        res.status(201).json({
          message: "User created!",
          result: result,
        });
      })
      .catch((err) => {
        res.status(500).json({
          error: err.message,
        });
      });
  });
});

router.post("/login", (req, res, next) => {
  let currentUser;
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          message: "Authentication is denied",
        });
      }
      currentUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then((result) => {
      if (!result) {
        return res.status(401).json({
          message: "Authentication is denied",
        });
      }

      const token = jwt.sign(
        {
          usernam: currentUser.username,
          email: currentUser.email,
          userId: currentUser._id,
        },
        "this_is_the_secret_use_to_sign_the_token_it_has_to_be_a_very_long_sentence",
        { expiresIn: "1h" }
      );
      res.status(200).json({
        messsage: "Successful uthentication",
        token: token,
        expiresIn: 3600,
      });
    })
    .catch((error) => {
      return res.status(401).json({
        message: "Authentication is denied",
        error: error,
      });
    });
});

module.exports = router;
