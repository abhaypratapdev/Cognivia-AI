const { User, File } = require("../models");
const cloudinary = require("../config/cloudinary");
const axios = require("axios");

/**
 * Upload file to Cloudinary
 */
exports.uploadToCloudinary = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const mimeType = req.file.mimetype;

    // ðŸ”¥ Decide resource type
    const isImage = mimeType.startsWith("image/");
    const resourceType = isImage ? "image" : "raw";

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "Congivia AI_uploads",
        resource_type: resourceType, // âœ… IMPORTANT
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return res.status(500).json({
            success: false,
            message: error.message || "Cloudinary upload failed",
          });
        }

        res.json({
          success: true,
          url: result.secure_url,
        });
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({
      success: false,
      message: err.message || "Upload failed",
    });
  }
};

/**
 * Save file metadata
 */
exports.uploadFileUrl = async (req, res) => {
  try {
    const { userId, filename, fileUrl, fileType, fileSize } = req.body;

    // 1ï¸âƒ£ Validate user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // 2ï¸âƒ£ Save file
    const file = await File.create({
      userId: user._id,
      userName: user.name, // âœ… matches schema
      filename,
      fileUrl,
      fileType,
      fileSize,
    });

    res.json({
      success: true,
      data: file,
    });
  } catch (error) {
    console.error("Save file error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to save file",
    });
  }
};

/**
 * Get user files
 */
exports.getUserFiles = async (req, res) => {
  try {
    const { userId } = req.params;
    const { search = "", type = "all" } = req.query;
    const query = { userId };

    if (search.trim()) {
      query.filename = { $regex: search.trim(), $options: "i" };
    }

    if (type === "pdf") {
      query.fileType = "application/pdf";
    } else if (type === "image") {
      query.fileType = { $regex: "^image/", $options: "i" };
    }

    const files = await File.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user files",
    });
  }
};

/**
 * Delete file
 */
exports.deleteFile = async (req, res) => {
  try {
    const { fileId } = req.params;

    await File.findByIdAndDelete(fileId);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false });
  }
};

/**
 * Proxy PDF (for viewer)
 */
exports.proxyPdf = async (req, res) => {
  try {
    const { url } = req.query;

    if (!url) {
      return res.status(400).json({ message: "PDF URL required" });
    }

    const response = await axios.get(url, {
      responseType: "arraybuffer",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.send(response.data);
  } catch (error) {
    console.error("PDF proxy error:", error.message);
    res.status(500).json({ message: "Failed to load PDF" });
  }
};
