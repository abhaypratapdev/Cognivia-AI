const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const quizController = require("../controllers/quizController");

const router = express.Router();

router.use(authMiddleware);

router.get("/quiz", quizController.listQuizzes);
router.post("/quiz/generate", quizController.generateQuiz);
router.post("/quiz/:quizId/start", quizController.startQuiz);
router.post("/quiz/:quizId/submit", quizController.submitQuiz);

module.exports = router;
