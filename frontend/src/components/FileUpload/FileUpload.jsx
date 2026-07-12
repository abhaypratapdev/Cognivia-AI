import React, { useState, useEffect } from "react";
import {
  uploadToCloudinary,
  saveFileUrlToDatabase,
  getUserFiles,
  deleteUserFile,
} from "../../utils/cloudinaryUpload";
import toast from "react-hot-toast";

const FileUploadComponent = ({ userId }) => {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userFiles, setUserFiles] = useState([]);

  // Fetch user files on component mount
  useEffect(() => {
    if (userId) {
      fetchUserFiles();
    }
  }, [userId]);

  const fetchUserFiles = async () => {
    setIsLoading(true);
    try {
      console.log("🔍 Fetching files for userId:", userId);
      const result = await getUserFiles(userId);
      console.log("📦 API Response:", result);
      if (result.success) {
        console.log("✅ Files loaded:", result.data);
        setUserFiles(result.data || []);
      } else {
        console.error("❌ API returned error:", result.message);
        toast.error(result.message || "Failed to fetch files");
      }
    } catch (error) {
      console.error("❌ Error fetching user files:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
      });
      toast.error("Error loading files");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error("Please select at least one file");
      return;
    }

    setIsLoading(true);

    try {
      for (const file of files) {
        const uploadPromise = (async () => {
          console.log("📤 Starting upload for:", file.name);
          const cloudinaryUrl = await uploadToCloudinary(file);
          console.log("✅ Cloudinary URL received:", cloudinaryUrl);

          console.log("💾 Saving to database with:", {
            userId,
            filename: file.name,
            fileUrl: cloudinaryUrl,
            fileType: file.type,
            fileSize: file.size,
          });

          const saveResult = await saveFileUrlToDatabase(
            userId,
            file.name,
            cloudinaryUrl,
            file.type,
            file.size
          );

          console.log("✅ Database save result:", saveResult);
          return { success: true };
        })();

        toast.promise(uploadPromise, {
          loading: `Uploading ${file.name}...`,
          success: `${file.name} uploaded successfully!`,
          error: (err) => `Error uploading ${file.name}: ${err.message}`,
        });

        const result = await uploadPromise;
        if (!result.success) {
          console.error(`Failed to upload ${file.name}`);
        }
      }

      // Refresh file list
      console.log("🔄 Refreshing file list after upload...");
      await fetchUserFiles();
      setFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (confirm("Are you sure you want to delete this file?")) {
      setIsLoading(true);
      const result = await deleteUserFile(userId, fileId);

      if (result.success) {
        toast.success("File deleted successfully");
        await fetchUserFiles();
      } else {
        toast.error(`Error: ${result.error}`);
      }
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6">File Upload Manager</h2>

        {/* Upload Section */}
        <div className="mb-8 p-4 border-2 border-dashed border-gray-300 rounded-lg">
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
            className="w-full"
          />
          {files.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">
                Selected files: {files.length}
              </p>
              <ul className="text-sm mb-4">
                {files.map((file, idx) => (
                  <li key={idx} className="text-gray-700">
                    • {file.name} ({formatFileSize(file.size)})
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleUpload}
            disabled={isLoading || files.length === 0}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
          >
            {isLoading ? "Uploading..." : "Upload Files"}
          </button>
        </div>

        {/* Files List Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Your Files</h3>
          {userFiles.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No files uploaded yet
            </p>
          ) : (
            <div className="space-y-3">
              {userFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">
                      {file.filename}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.fileSize)} •{" "}
                      {formatDate(file.uploadedAt)}
                    </p>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white py-1 px-3 rounded text-sm hover:bg-green-600 transition"
                    >
                      View
                    </a>
                    <button
                      onClick={() => handleDelete(file.id)}
                      disabled={isLoading}
                      className="bg-red-500 text-white py-1 px-3 rounded text-sm hover:bg-red-600 disabled:bg-gray-400 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploadComponent;
