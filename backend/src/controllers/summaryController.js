const { extractText } = require("../../services/ocrService");
const { generateSummary } = require("../../services/summaryService");
const Summary = require("../models/Summary");
const { File } = require("../models");

async function resolveFilePayload({ userId, fileId, fileUrl, fileType, filename }) {
  if (userId && fileUrl) {
    return { userId, fileId, fileUrl, fileType, filename };
  }

  if (!fileId) {
    throw new Error("fileId is required");
  }

  const fileDoc = await File.findById(fileId);
  if (!fileDoc) {
    const error = new Error("File not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    userId: userId || fileDoc.userId,
    fileId,
    fileUrl: fileUrl || fileDoc.fileUrl,
    fileType: fileType || fileDoc.fileType,
    filename: filename || fileDoc.filename,
  };
}

exports.generateAndSaveSummary = async (req, res) => {
  try {
    const payload = await resolveFilePayload(req.body);
    const existing = payload.fileId
      ? await Summary.findOne({ fileId: payload.fileId })
      : null;
    const summaryType = req.body.summaryType || existing?.summaryType || "detailed";

    let text = (req.body.text || existing?.text || "").trim();
    if (!text) {
      text = await extractText({
        fileUrl: payload.fileUrl,
        fileType: payload.fileType,
        filename: payload.filename,
      });
    }

    const summary = await generateSummary(text, { summaryType });

    const saved = await Summary.findOneAndUpdate(
      { fileId: payload.fileId },
      {
        userId: payload.userId,
        fileId: payload.fileId,
        text,
        summary,
        summaryType,
      },
      { upsert: true, new: true }
    );

    return res.json({
      success: true,
      summary: saved.summary,
      text: saved.text,
      summaryType: saved.summaryType,
    });
  } catch (err) {
    console.error("❌ [SUMMARY] Error:", err);
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message || "Summary generation failed" });
  }
};

// Extract OCR text only and save (upsert) — returns saved text
exports.extractTextOnly = async (req, res) => {
  try {
    const payload = await resolveFilePayload(req.body);
    const text = await extractText({
      fileUrl: payload.fileUrl,
      fileType: payload.fileType,
      filename: payload.filename,
      text: req.body.text,
    });

    const saved = await Summary.findOneAndUpdate(
      { fileId: payload.fileId },
      { userId: payload.userId, fileId: payload.fileId, text },
      { upsert: true, new: true }
    );

    res.json({ success: true, text: saved.text });
  } catch (err) {
    console.error("❌ [OCR] Error:", err);
    res
      .status(err.statusCode || 500)
      .json({ success: false, message: err.message || "OCR extraction failed" });
  }
};

// Get summary/document by fileId
exports.getSummaryByFileId = async (req, res) => {
  try {
    const { fileId } = req.params;
    const doc = await Summary.findOne({ fileId });
    res.json({ success: true, data: doc || null });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch summary" });
  }
};
