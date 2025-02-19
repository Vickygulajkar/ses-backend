const mongoose = require("mongoose");
require("dotenv").config();

const { MONGO_STRING } = process.env;

exports.dbConnection = async () => {
  try {
    await mongoose.connect(MONGO_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected with MongoDB...");
  } catch (error) {
    console.error("Error while connecting...", error);
  }
};
