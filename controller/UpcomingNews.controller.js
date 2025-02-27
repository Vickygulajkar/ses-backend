const UpcomingNews = require("../model/UpcomingNews.model");

exports.createUpcomingNews = async (req, res) => {
  try {
    const { title, content, StartDate, EndDate } = req.body;

    if (!title || !content || !StartDate) {
      return res.status(400).json({
        status: false,
        message: "Title, content, and StartDate are required",
      });
    }

    const upcomingNews = new UpcomingNews({
      title,
      content,
      StartDate,
      ...(EndDate && { EndDate }), // Only add EndDate if provided
    });

    await upcomingNews.save();

    return res.status(201).json({
      status: true,
      message: "Upcoming news created successfully",
      data: upcomingNews,
    });
  } catch (error) {
    console.error("Error creating upcoming news:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to create upcoming news",
    });
  }
};

exports.getAllUpcomingNews = async (req, res) => {
  try {
    const upcomingNewsList = await UpcomingNews.find();

    console.log("Fetched Data:", upcomingNewsList);

    if (!upcomingNewsList || upcomingNewsList.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No upcoming news found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Upcoming news retrieved successfully",
      data: upcomingNewsList,
    });
  } catch (error) {
    console.error("Error retrieving upcoming news:", error);
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve upcoming news",
      error: error.message,
    });
  }
};
