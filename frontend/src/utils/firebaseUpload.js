import { storage } from "../config/firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  uploadBytesResumable,
} from "firebase/storage";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";

/**
 * Upload file to Firebase Storage and save URL to MongoDB
 * @param {File} file - File to upload
 * @param {string} userId - User ID to associate with the file
 * @returns {Promise<Object>} - Returns { success, data, error }
 */
export const uploadFileToFirebase = async (file, userId) => {
  try {
    if (!file) {
      throw new Error("No file provided");
    }

    if (!userId) {
      throw new Error("User ID is required");
    }

    // Validate file size (max 100MB)
    const MAX_FILE_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      throw new Error("File size exceeds 100MB limit");
    }

    // Create a unique file path in Firebase Storage
    const timestamp = Date.now();
    const filename = `${userId}/${timestamp}_${file.name}`;
    const fileRef = ref(storage, filename);

    // Upload file to Firebase Storage using resumable upload (gives progress)
    console.log("📤 Starting resumable upload to Firebase Storage...");

    const uploadTask = uploadBytesResumable
      ? uploadBytesResumable(fileRef, file)
      : null;

    // Fallback to uploadBytes if uploadBytesResumable is not available
    let firebaseUrl;

    if (uploadTask) {
      // Wrap in a promise to monitor progress and completion with timeout
      firebaseUrl = await new Promise((resolve, reject) => {
        let lastProgress = 0;
        const timeoutMs = 90000; // 90 seconds
        let timeoutHandle = setTimeout(() => {
          reject(new Error("Upload timeout after 90s"));
        }, timeoutMs);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            if (progress !== lastProgress) {
              lastProgress = progress;
              console.log(`📈 Upload is ${Math.round(progress)}% done`);
            }
          },
          (error) => {
            clearTimeout(timeoutHandle);
            reject(error);
          },
          async () => {
            try {
              clearTimeout(timeoutHandle);
              const url = await getDownloadURL(fileRef);
              console.log(
                "✅ File uploaded successfully:",
                fileRef.fullPath || fileRef.name || ""
              );
              console.log("🔗 Download URL:", url);
              resolve(url);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    } else {
      // If resumable upload API is not available, fall back
      console.log(
        "⚠️ uploadBytesResumable not available, using uploadBytes fallback"
      );
      const snapshot = await uploadBytes(fileRef, file);
      console.log("✅ File uploaded successfully:", snapshot.ref.fullPath);
      firebaseUrl = await getDownloadURL(fileRef);
      console.log("🔗 Download URL:", firebaseUrl);
    }

    // Save file URL to MongoDB
    const response = await axios.post(`${API_BASE_URL}/files/upload-url`, {
      userId,
      filename: file.name,
      firebaseUrl,
      fileType: file.type,
      fileSize: file.size,
    });

    if (response.data.success) {
      console.log("✅ File URL saved to MongoDB");
      return {
        success: true,
        data: response.data.data,
        firebaseUrl,
      };
    } else {
      throw new Error("Failed to save file URL to database");
    }
  } catch (error) {
    console.error("❌ Error uploading file:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get all files for a specific user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Returns { success, data, error }
 */
export const getUserFiles = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axios.get(
      `${API_BASE_URL}/files/user/${userId}/files`
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } else {
      throw new Error("Failed to fetch files");
    }
  } catch (error) {
    console.error("❌ Error fetching user files:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Delete a file from user's file list
 * @param {string} userId - User ID
 * @param {string} fileId - File ID (MongoDB _id)
 * @returns {Promise<Object>} - Returns { success, data, error }
 */
export const deleteUserFile = async (userId, fileId) => {
  try {
    if (!userId || !fileId) {
      throw new Error("User ID and File ID are required");
    }

    const response = await axios.delete(
      `${API_BASE_URL}/files/user/${userId}/files/${fileId}`
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      throw new Error("Failed to delete file");
    }
  } catch (error) {
    console.error("❌ Error deleting file:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Get file statistics for a user
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Returns { success, data, error }
 */
export const getFileStats = async (userId) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const response = await axios.get(
      `${API_BASE_URL}/files/user/${userId}/stats`
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
      };
    } else {
      throw new Error("Failed to fetch file statistics");
    }
  } catch (error) {
    console.error("❌ Error fetching file statistics:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Search user files
 * @param {string} userId - User ID
 * @param {string} query - Search query
 * @returns {Promise<Object>} - Returns { success, data, error }
 */
export const searchUserFiles = async (userId, query) => {
  try {
    if (!userId || !query) {
      throw new Error("User ID and search query are required");
    }

    const response = await axios.get(
      `${API_BASE_URL}/files/user/${userId}/search?query=${encodeURIComponent(
        query
      )}`
    );

    if (response.data.success) {
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
      };
    } else {
      throw new Error("Failed to search files");
    }
  } catch (error) {
    console.error("❌ Error searching files:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Download file from Firebase URL
 * @param {string} fileUrl - Firebase download URL
 * @param {string} filename - File name for download
 */
export const downloadFile = (fileUrl, filename) => {
  try {
    if (!fileUrl) {
      throw new Error("File URL is required");
    }

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = filename || "download";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log("✅ File download started");
  } catch (error) {
    console.error("❌ Error downloading file:", error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Format date for display
 * @param {string|Date} date - Date to format
 * @returns {string} - Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Get file icon based on file type
 * @param {string} fileType - MIME type
 * @returns {string} - Icon name
 */
export const getFileIcon = (fileType) => {
  if (!fileType) return "file";
  if (fileType.includes("image")) return "image";
  if (fileType.includes("video")) return "video";
  if (fileType.includes("audio")) return "music";
  if (fileType.includes("pdf")) return "file-pdf";
  if (fileType.includes("word") || fileType.includes("document"))
    return "file-word";
  if (fileType.includes("sheet") || fileType.includes("excel"))
    return "file-excel";
  if (fileType.includes("zip") || fileType.includes("compressed"))
    return "file-archive";
  return "file";
};
