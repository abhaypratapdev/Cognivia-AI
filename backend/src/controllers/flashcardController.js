const Flashcard = require("../models/Flashcard");
const Summary = require("../models/Summary");
const File = require("../models/File");
const { extractText } = require("../../services/ocrService");
const { generateSummary } = require("../../services/summaryService");
const { generateFlashcards } = require("../../services/flashcardService");

exports.getFlashcardsByFile = async (req, res) => {
  try {
    const doc = await Flashcard.findOne({
      userId: req.user._id,
      fileId: req.params.fileId,
    }).sort({ updatedAt: -1 });

    res.json({ success: true, data: doc || null });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to fetch flashcards" });
  }
};

exports.generateFlashcardsForFile = async (req, res) => {
  try {
    const { fileId, cardCount = 10 } = req.body;
    if (!fileId) {
      return res.status(400).json({ success: false, message: "fileId is required" });
    }

    const [file, summaryDoc] = await Promise.all([
      File.findById(fileId),
      Summary.findOne({ fileId }),
    ]);

    if (!file) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    if (String(file.userId) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Not allowed to use this file" });
    }

    let sourceText = summaryDoc?.text || "";
    let sourceSummary = summaryDoc?.summary || "";

    if (!sourceText) {
      sourceText = await extractText({
        fileUrl: file.fileUrl,
        fileType: file.fileType,
        filename: file.filename,
      });
    }

    if (!sourceSummary && sourceText) {
      sourceSummary = await generateSummary(sourceText, { summaryType: "exam" });
    }

    if (!sourceText && !sourceSummary) {
      return res.status(422).json({
        success: false,
        message: "Not enough content to generate flashcards",
      });
    }

    await Summary.findOneAndUpdate(
      { fileId },
      {
        userId: req.user._id,
        fileId,
        text: sourceText,
        summary: sourceSummary,
      },
      { upsert: true, new: true }
    );

    const cards = await generateFlashcards({
      title: file.filename,
      summary: sourceSummary,
      text: sourceText,
      cardCount: Number(cardCount) || 10,
    });

    const flashcardDoc = await Flashcard.findOneAndUpdate(
      { userId: req.user._id, fileId },
      {
        userId: req.user._id,
        fileId,
        title: `${file.filename} Flashcards`,
        cards,
      },
      { upsert: true, new: true }
    );

    res.json({ success: true, data: flashcardDoc });
  } catch (error) {
    console.error("❌ [FLASHCARD] Generation failed:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to generate flashcards",
    });
  }
};
