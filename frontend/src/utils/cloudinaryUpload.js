import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

/* =========================================================
   UPLOAD FILE (via backend → Cloudinary)
   ========================================================= */
export const uploadToCloudinary = async (file) => {
  if (!file) throw new Error("No file provided");

  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size exceeds 100MB limit");
  }

const formData = new FormData();  formData.append("file", file);

  try {
    const res = await axios.post(`${API_BASE_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!res.data?.success) {
      throw new Error("Cloudinary upload failed");
    }

    return res.data.url;
  } catch (err) {
    console.error("❌ Upload error:", err);
    throw err;
  }
};

/* =========================================================
   SAVE FILE METADATA TO DATABASE
   ========================================================= */
export const saveFileUrlToDatabase = async (
  userId,
  filename,
  fileUrl,
  fileType,
  fileSize
) => {
  if (!userId || !filename || !fileUrl) {
    throw new Error("Missing required file data");
  }

  try {
    const res = await axios.post(`${API_BASE_URL}/files/upload-url`, {
      userId,
      filename,
      fileUrl,
      fileType,
      fileSize,
    });

    if (!res.data?.success) {
      throw new Error("Failed to save file metadata");
    }

    return res.data.data;
  } catch (err) {
    console.error("❌ Save file error:", err);
    throw err;
  }
};

/* =========================================================
   GET ALL FILES FOR USER
   (⚠️ FIXED ROUTE)
   ========================================================= */
export const getUserFiles = async (userId, params = {}) => {
  const response = await axios.get(
    `${API_BASE_URL}/files/user/${userId}`,
    { params }
  );
  return response.data;
};

/* =========================================================
   DELETE FILE
   ========================================================= */
export const deleteUserFile = async (userId, fileId) => {
  if (!userId || !fileId) throw new Error("Missing userId or fileId");

  const res = await axios.delete(
    `${API_BASE_URL}/files/${fileId}`,
    { data: { userId } }
  );

  return res.data;
};
