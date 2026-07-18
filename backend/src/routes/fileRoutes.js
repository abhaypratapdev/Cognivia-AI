const express = require("express");
const multer = require("multer");
const fileController = require("../controllers/fileController");
const summaryController = require("../controllers/summaryController");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

console.log("📍 Registering file routes...");

// Upload
router.post(
  "/upload",
  upload.single("file"),
  fileController.uploadToCloudinary
);

// Save URL
router.post("/files/upload-url", fileController.uploadFileUrl);

// Get files
router.get("/files/user/:userId", fileController.getUserFiles);

// Delete file
router.delete("/files/:fileId", fileController.deleteFile);
// Summary
router.post("/summary/generate", summaryController.generateAndSaveSummary);
console.log("✅ Registered: POST /api/summary/generate");

// OCR extract only
router.post("/ocr/extract", summaryController.extractTextOnly);
console.log("✅ Registered: POST /api/ocr/extract");

// Get summary/doc by fileId
router.get("/summary/:fileId", summaryController.getSummaryByFileId);
console.log("✅ Registered: GET /api/summary/:fileId");

router.get("/files/proxy-pdf", fileController.proxyPdf);

module.exports = router;
