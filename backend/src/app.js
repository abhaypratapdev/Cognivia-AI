const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const fileRoutes = require("./routes/fileRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const quizRoutes = require("./routes/quizRoutes");
const flashcardRoutes = require("./routes/flashcardRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// 🏥 HEALTH CHECK ENDPOINT (Keep-alive for Render free tier)
app.get("/health", (req, res) => {
  res
    .status(200)
    .json({
      status: "✅ Backend is alive",
      timestamp: new Date().toISOString(),
    });
});

console.log("🚀 Setting up routes...");
app.use("/api/auth", authRoutes); // ✅ THIS FIXES 404
app.use("/api", fileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", quizRoutes);
app.use("/api", flashcardRoutes);
console.log("✅ All routes mounted");

module.exports = app;
