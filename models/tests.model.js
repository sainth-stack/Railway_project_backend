const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    testTitle: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("tests", Schema);
