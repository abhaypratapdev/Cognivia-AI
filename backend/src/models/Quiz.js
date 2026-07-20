const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    fileId: mongoose.Schema.Types.ObjectId,
    title: {
      type: String,
      default: "Generated Quiz",
    },
    description: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
      default: 10,
    },
    sourceSummary: String,
    sourceText: String,
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },

    questions: [
      {
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
      },
    ],
    attempts: [
      {
        answers: [Number],
        score: Number,
        total: Number,
        accuracy: Number,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);
