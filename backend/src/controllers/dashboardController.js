const File = require("../models/File");
const Summary = require("../models/Summary");
const Quiz = require("../models/Quiz");
const Planner = require("../models/Planner");
const User = require("../models/User");

const normalizeSubjects = (subjects) => {
  if (!subjects) return [];

  if (Array.isArray(subjects)) {
    return subjects
      .map((subject) => {
        if (typeof subject === "string") {
          return subject.trim();
        }

        if (subject && typeof subject.name === "string") {
          return subject.name.trim();
        }

        return "";
      })
      .filter(Boolean);
  }

  if (typeof subjects === "string") {
    return subjects
      .split(",")
      .map((subject) => subject.trim())
      .filter(Boolean);
  }

  return [];
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const [filesUploaded, summariesCreated, quizzesTaken] = await Promise.all([
      File.countDocuments({ userId }),
      Summary.countDocuments({ userId }),
      Quiz.countDocuments({ userId }),
    ]);

    res.json({
      filesUploaded,
      summariesCreated,
      quizzesTaken,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Quiz.aggregate([
      {
        $group: {
          _id: "$userId",
          quizzesTaken: { $sum: 1 },
          totalScore: {
            $sum: {
              $size: {
                $ifNull: ["$questions", []],
              },
            },
          },
        },
      },
      { $sort: { totalScore: -1, quizzesTaken: -1 } },
      {
        $lookup: {
          from: User.collection.name,
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $project: {
          _id: 1,
          quizzesTaken: 1,
          totalScore: 1,
          user: {
            _id: "$user._id",
            name: "$user.name",
            email: "$user.email",
            college: "$user.college",
            photo: "$user.photo",
          },
        },
      },
    ]);

    res.json(leaderboard);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
};

exports.getPlans = async (req, res) => {
  try {
    const plans = await Planner.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(plans);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch plans" });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const { name = "", subjects, hoursPerDay, examDate, schedule = [] } = req.body;

    const normalizedSubjects = normalizeSubjects(subjects);

    if (!normalizedSubjects.length || !hoursPerDay || !examDate) {
      return res.status(400).json({ message: "Missing required plan fields" });
    }

    const plan = await Planner.create({
      userId: req.user._id,
      name: typeof name === "string" ? name.trim() : "",
      subjects: normalizedSubjects,
      hoursPerDay: Number(hoursPerDay),
      examDate,
      schedule: Array.isArray(schedule) ? schedule : [],
    });

    res.status(201).json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan" });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const { name = "", subjects, hoursPerDay, examDate, schedule } = req.body;
    const update = {};

    if (subjects !== undefined) {
      const normalizedSubjects = normalizeSubjects(subjects);
      if (!normalizedSubjects.length) {
        return res.status(400).json({ message: "Subjects cannot be empty" });
      }
      update.subjects = normalizedSubjects;
    }

    if (hoursPerDay !== undefined) {
      update.hoursPerDay = Number(hoursPerDay);
    }

    if (examDate !== undefined) {
      update.examDate = examDate;
    }

    if (name !== undefined) {
      update.name = typeof name === "string" ? name.trim() : "";
    }

    if (schedule !== undefined) {
      update.schedule = Array.isArray(schedule) ? schedule : [];
    }

    const plan = await Planner.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      update,
      { new: true, runValidators: true }
    );

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan" });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const plan = await Planner.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan" });
  }
};
