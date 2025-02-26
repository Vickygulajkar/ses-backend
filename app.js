var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { dbConnection } = require("./config/db.js");
const cors = require("cors");
require("dotenv").config();

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var AlumniMemberRouter = require("./routes/AlumniMembers.router.js");
var AdmissionRouter = require("./routes/Admission.route.js");
const loginRoutes = require("./routes/loginRoutes");
const UpcomingNewsRoutes = require("./routes/UpcomingNews.router.js");

var app = express();
dbConnection();

// Enable CORS
app.use(cors());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Set views directory and engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/alumni-member", AlumniMemberRouter);
app.use("/api/admission", AdmissionRouter);
app.use("/api", loginRoutes);
app.use("/api", UpcomingNewsRoutes);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

// **PORT BINDING** (Fix for Render Deployment Issue)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
