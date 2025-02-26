const express = require("express");
const { createUpcomingNews, getAllUpcomingNews } = require("../controller/UpcomingNews.controller");
const router = express.Router();

router.post("/admin/addNews", createUpcomingNews);
router.get("/admin/getUpcomingNews", getAllUpcomingNews);

module.exports = router;
