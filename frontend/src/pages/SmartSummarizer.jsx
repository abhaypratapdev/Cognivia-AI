import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../utils/api';
import { toast } from 'react-hot-toast';
import {
  FiUpload,
  FiFileText,
  FiCopy,
  FiDownload,
  FiTrash2,
  FiHistory,
  FiZap,
} from 'react-icons/fi';

import LoadingSpinner from '../components/LoadingSpinner';
import MindMap from './MindMap';
import { uploadToCloudinary } from "../utils/cloudinaryUpload";

export default function SmartSummarizer() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showMindMap, setShowMindMap] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/summarizer/history");
      setHistory(res.data.summaries || []);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    try {
      setUploading(true);

      // 1️⃣ Upload file to Cloudinary
      toast.loading("Uploading file to Cloudinary...");
      const cloudinaryUrl = await uploadToCloudinary(file);

      toast.success("File uploaded successfully!");

      // 2️⃣ Send file + URL to summarizer backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileUrl", cloudinaryUrl);

      setUploading(false);
      setSummarizing(true);
      toast.loading("Extracting text & generating summary...");

      const res = await api.post("/summarizer/summarize", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 3️⃣ Attach Cloudinary URL to summary for UI
      setSummary({
        ...res.data.summary,
        fileUrl: cloudinaryUrl,
      });

      toast.success("Summary generated!");
      fetchHistory();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process file");
    } finally {
      setUploading(false);
      setSummarizing(false);
      toast.dismiss();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(summary?.text || "");
    toast.success("Copied to clipboard!");
  };

  const downloadSummary = () => {
    const blob = new Blob([summary?.text || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `summary-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Summary downloaded!");
  };

  const deleteSummary = async (id) => {
    try {
      await api.delete(`/summarizer/${id}`);
      toast.success("Summary deleted!");
      fetchHistory();
      if (summary?._id === id) setSummary(null);
    } catch (error) {
      toast.error("Failed to delete summary");
    }
  };

  const loadSummary = (summaryItem) => {
    setSummary(summaryItem);
    setShowHistory(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Smart Summarizer
          </h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            <FiHistory className="w-5 h-5" />
            History
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Upload File
              </h2>

              <div className="space-y-4">
                {/* File Upload Box */}
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition">
                  <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />

                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Choose file
                  </label>

                  {file && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      {file.name}
                    </p>
                  )}

                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    PDF, DOCX, TXT, or Images (max 10MB)
                  </p>
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || summarizing}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {(uploading || summarizing) ? (
                    <>
                      <LoadingSpinner size="sm" />
                      {uploading ? "Uploading..." : "Summarizing..."}
                    </>
                  ) : (
                    <>
                      <FiFileText className="w-5 h-5" />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Summary Display */}
          <div className="lg:col-span-2">
            {summary ? (
              <div className="space-y-6">
                {/* Summary Card */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Summary
                    </h2>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowMindMap(!showMindMap)}
                        className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded"
                        title="Generate Mind Map"
                      >
                        <FiZap className="w-5 h-5" />
                      </button>

                      <button
                        onClick={copyToClipboard}
                        className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                        title="Copy"
                      >
                        <FiCopy className="w-5 h-5" />
                      </button>

                      <button
                        onClick={downloadSummary}
                        className="p-2 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded"
                        title="Download"
                      >
                        <FiDownload className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Summary Text */}
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {summary.text}
                  </p>

                  {/* Image Preview (Cloudinary) */}
                  {summary.fileUrl &&
                    summary.fileUrl.includes("cloudinary.com") && (
                      <div className="mt-6">
                        <img
                          src={summary.fileUrl}
                          alt="Uploaded File"
                          className="rounded-xl shadow max-h-80 object-contain"
                        />
                      </div>
                    )}
                </div>

                {/* Mind Map */}
                {showMindMap && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                      Mind Map
                    </h3>
                    <MindMap summaryText={summary.text} />
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
                <FiFileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                  Upload a file to generate an AI-powered summary
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Modal */}
        {showHistory && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Summary History
                  </h2>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    ✕
                  </button>
                </div>

                {/* History List */}
                <div className="space-y-4">
                  {history.length > 0 ? (
                    history.map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {item.originalFile || "Untitled"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => loadSummary(item)}
                              className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                            >
                              View
                            </button>

                            <button
                              onClick={() => deleteSummary(item._id)}
                              className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            >
                              <FiTrash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                          {item.text}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                      No summaries yet
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}