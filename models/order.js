const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  courses: {
    type: Object,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

exports.Order = mongoose.model("Order", orderSchema);
