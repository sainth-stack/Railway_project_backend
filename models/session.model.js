const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
    coachId:{
      type:String,

    },
    batchId:{
      type:String,
    },
    sessionid : {
      type:String
    },
    sessionDate : {
      type:String
    }
  },

  { timestamps: true }
);

module.exports = mongoose.model("sessions", Schema);
