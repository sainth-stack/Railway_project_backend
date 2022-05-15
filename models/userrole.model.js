const mongoose = require("mongoose");

const Schema = new mongoose.Schema(
  {
role:{
    type:String,
    require:true
},
rolename:{
  type:String,
  
}

  },

  { timestamps: true }
);

module.exports = mongoose.model("userroles", Schema);
