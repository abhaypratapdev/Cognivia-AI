const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const flashcardController = require("../controllers/flashcardController");

const router = express.Router();

router.use(authMiddleware);
router.get("/flashcards/:fileId", flashcardController.getFlashcardsByFile);
router.post("/flashcards/generate", flashcardController.generateFlashcardsForFile);

module.exports = router;
