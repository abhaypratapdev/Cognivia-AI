const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.use(authMiddleware);

router.get("/dashboard/stats", dashboardController.getDashboardStats);
router.get("/leaderboard", dashboardController.getLeaderboard);
router.get("/planner", dashboardController.getPlans);
router.post("/planner", dashboardController.createPlan);
router.put("/planner/:id", dashboardController.updatePlan);
router.delete("/planner/:id", dashboardController.deletePlan);

module.exports = router;
