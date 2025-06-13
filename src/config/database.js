const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://Node:node@cluster0.e6rgux0.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
