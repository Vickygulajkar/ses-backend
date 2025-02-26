const mongoose = require("mongoose");

const upcomingNewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  StartDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  EndDate: {
    type: Date, 
  },
});

const UpcomingNews = mongoose.model("UpcomingNews", upcomingNewsSchema);
module.exports = UpcomingNews;
