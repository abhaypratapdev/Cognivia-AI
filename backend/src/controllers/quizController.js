const Quiz = require("../models/Quiz");
const Summary = require("../models/Summary");
const File = require("../models/File");
const { generateQuizFromContent } = require("../../services/quizService");
const { extractText } = require("../../services/ocrService");
const { generateSummary } = require("../../services/summaryService");
const mongoose = require("mongoose");

function formatQuizResponse(quiz) {
  const attempts = Array.isArray(quiz.attempts) ? quiz.attempts : [];
  const latestAttempt = attempts.length ? attempts[attempts.length - 1] : null;
  return {
    _id: quiz._id,
    title: quiz.title,
    description: quiz.description,
    duration: quiz.duration,
    fileId: quiz.fileId,
    difficulty: quiz.difficulty || "medium",
    attemptsCount: attempts.length,
    bestScore: attempts.length ? Math.max(...attempts.map((attempt) => attempt.score || 0)) : 0,
    latestAttempt,
    questions: (Array.isArray(quiz.questions) ? quiz.questions : []).map((question) => ({
      question: question.question,
      options: question.options,
      explanation: question.explanation,
    })),
  };
}

exports.listQuizzes = async (req, res) => {
  try {
    const filter = { userId: req.user._id };
    if (
      req.query.fileId &&
      req.query.fileId !== "undefined" &&
      mongoose.Types.ObjectId.isValid(req.query.fileId)
    ) {
      filter.fileId = req.query.fileId;
    }

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });
    res.json(quizzes.map((quiz) => formatQuizResponse(quiz)));
  } catch (error) {
    console.error("❌ [QUIZ] Failed to list quizzes:", error);
    res.status(500).json({ message: "Failed to load quizzes" });
  }
};

exports.generateQuiz = async (req, res) => {
  try {
    const { fileId, difficulty = "medium" } = req.body;

    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      return res.status(400).json({ message: "fileId is required" });
    }

    const [file, summaryDoc] = await Promise.all([
      File.findById(fileId),
      Summary.findOne({ fileId }),
    ]);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    if (String(file.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not allowed to use this file" });
    }

    const existingQuiz = await Quiz.findOne({
      userId: req.user._id,
      fileId,
    }).sort({ createdAt: -1 });

    if (existingQuiz) {
      return res.status(200).json({
        message: "Quiz already exists",
        quiz: formatQuizResponse(existingQuiz),
      });
    }

    let sourceText = summaryDoc?.text || "";
    let sourceSummary = summaryDoc?.summary || "";

    if (!sourceText) {
      try {
        sourceText = await extractText({
          fileUrl: file.fileUrl,
          fileType: file.fileType,
          filename: file.filename,
        });
      } catch (error) {
        console.error("❌ [QUIZ] Text extraction failed:", error.message);
        if (!sourceSummary) {
          return res.status(422).json({
            message:
              "Quiz generation needs extracted document text or a saved summary. Open the file in Summarizer first and let extraction finish.",
          });
        }
      }
    }

    if (!sourceSummary && sourceText) {
      sourceSummary = await generateSummary(sourceText);
    }

    if (sourceText || sourceSummary) {
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
    }

    const quizPayload = await generateQuizFromContent({
      title: file.filename,
      summary: sourceSummary,
      text: sourceText,
      questionCount: Number(req.body.questionCount) || 8,
    });

    const quiz = await Quiz.create({
      userId: req.user._id,
      fileId,
      title: quizPayload.title,
      description: quizPayload.description,
      duration: quizPayload.duration,
      sourceSummary,
      sourceText,
      difficulty,
      questions: quizPayload.questions,
    });

    res.status(201).json({
      message: "Quiz generated successfully",
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        duration: quiz.duration,
        difficulty: quiz.difficulty,
        questions: quiz.questions,
      },
    });
  } catch (error) {
    console.error("❌ [QUIZ] Generation failed:", error);
    res.status(500).json({ message: error.message || "Failed to generate quiz" });
  }
};

exports.startQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.json(formatQuizResponse(quiz));
  } catch (error) {
    res.status(500).json({ message: "Failed to start quiz" });
  }
};

exports.submitQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findOne({
      _id: req.params.quizId,
      userId: req.user._id,
    });

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    const answers = Array.isArray(req.body.answers) ? req.body.answers : [];
    let score = 0;

    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score += 1;
      }
    });

    const total = quiz.questions.length;
    const accuracy = total ? Math.round((score / total) * 100) : 0;

    const review = quiz.questions.map((question, index) => ({
      question: question.question,
      options: question.options,
      explanation: question.explanation,
      selectedAnswer: answers[index] ?? null,
      correctAnswer: question.correctAnswer,
      isCorrect: answers[index] === question.correctAnswer,
    }));

    quiz.attempts = Array.isArray(quiz.attempts) ? quiz.attempts : [];
    quiz.attempts.push({
      answers,
      score,
      total,
      accuracy,
    });
    await quiz.save();

    res.json({
      score,
      total,
      accuracy,
      quizTitle: quiz.title,
      review,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit quiz" });
  }
};
