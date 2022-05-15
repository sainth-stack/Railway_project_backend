const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
   testid:{
     type:String
   },
   studentid:{
     type:String,
   },
   sessionId:{
     type:String
   }
  },

  { timestamps: true }
);

module.exports = mongoose.model("testsubmissions", Schema);
