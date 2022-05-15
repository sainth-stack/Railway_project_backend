const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
  },

  { timestamps: true }
);

module.exports = mongoose.model("batches", Schema);
