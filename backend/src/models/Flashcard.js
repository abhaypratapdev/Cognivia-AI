const mongoose = require("mongoose");

const flashcardSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
      required: true,
    },
    title: {
      type: String,
      default: "Flashcards",
    },
    cards: [
      {
        front: String,
        back: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Flashcard", flashcardSchema);
