const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("students", Schema);
