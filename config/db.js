const mongoose = require("mongoose");
const { DATABASE_URL } = require("./environment");

const connectDB = async () => {
  try {
    await mongoose.connect(DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Database Connection Success!');
    console.log(DATABASE_URL)
  } catch (err) {
    console.log('MongoDB Database Connection Failed!', err.message);
  }
};

module.exports = connectDB;