const { User } = require("../models/user");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
require("dotenv").config();

router.get(`/`, async (req, res) => {
  const userList = await User.find().select("-password");

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.status(200).send(userList);
});

router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res
      .status(500)
      .json({ message: "The User with the given ID was not found." });
  }
  res.status(200).send(user);
});

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    res.send("User succesfully deleted");
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!user) {
    return res.status(400).send("email incorrect");
  } else if (user && bcrypt.compareSync(req.body.password, user.password)) {
    const token = jwt.sign(
      {
        userId: user._id,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ user: user, token: token });
  } else {
    res.status(400).send("password incorrect");
  }
});

router.post("/register", async (req, res) => {
  const userCheck = await User.findOne({ email: req.body.email });
  if (userCheck) {
    res.status(400).send("Email Already registered");
  } else {
    const secret = process.env.secret;
    let user = new User({
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 10),
    });
    user = await user.save();

    if (!user) return res.status(400).send("the user cannot be created!");
    const token = jwt.sign(
      {
        doctoremail: req.body.email,
      },
      secret,
      { expiresIn: "1d" }
    );
    var sanitizeduser = _.omit(user.toObject(), "password");
    res.status(200).send({ user: sanitizeduser, token: token });
  }
});

module.exports = router;
