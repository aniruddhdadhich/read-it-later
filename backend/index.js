const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const linkRoutes = require("./routes/linkRoutes");
const youtubeRoutes = require("./routes/youtubeRoutes");
require('dotenv').config()

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());



// Database Connection
const mongoURI = process.env.MONGO_URI;
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api/articles", linkRoutes);
app.use("/api/yt-videos", youtubeRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
