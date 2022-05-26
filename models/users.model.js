const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    zone: {
      type: String,
      required: true,
    },
    division: {
      type: String,
      require: true,
    },
    role: {
      type: Array,
      required: true,
    },
    meta: {
      type: Object,
    },
    conformation:{
      type:String,
    },
 remarks:{
     type:Array,
 },
    batch_name: {
      type: String,
      require: true,
    },
  },

  { timestamps: true }
);

module.exports = mongoose.model("users", Schema);
