const { User } = require("../models/user");
const express = require("express");
const { Order } = require("../models/order");
const router = express.Router();
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

router.post("/", async (req, res) => {
  const order = new Order({
    courses: req.body.courses,
    userId: req.body.userId,
  });

  const result = order.save();
  if (!result) {
    res.status(500).send("Cannot create order !");
  } else {
    res.status(200).send(result);
  }
});

module.exports = router;
