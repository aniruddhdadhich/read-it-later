const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const linkRoutes = require("./routes/linkRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database Connection
const mongoURI = "mongodb+srv://aniruddh:S4QsepPqBMmJSgz5@cluster0.vkpyi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Database connection error:", err));

// Routes
app.use("/api/links", linkRoutes);

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
