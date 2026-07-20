const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },

    title: String,
    content: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);