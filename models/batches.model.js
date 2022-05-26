const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    batchName: {
      type: String,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("batches", Schema);
