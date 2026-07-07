import api from "./api";

export const generateSummary = async (fileId) => {
  const payload =
    typeof fileId === "object" && fileId !== null ? fileId : { fileId };
  const res = await api.post("/summary/generate", payload);
  return res.data;
};

export const extractTextOnly = async ({
  fileId,
  fileUrl,
  userId,
  fileType,
  filename,
  text,
}) => {
  const res = await api.post("/ocr/extract", {
    fileId,
    fileUrl,
    userId,
    fileType,
    filename,
    text,
  });
  return res.data;
};

export const getSummaryByFileId = async (fileId) => {
  const res = await api.get(`/summary/${fileId}`);
  return res.data;
};

export const getFlashcardsByFileId = async (fileId) => {
  const res = await api.get(`/flashcards/${fileId}`);
  return res.data;
};

export const generateFlashcards = async (payload) => {
  const res = await api.post("/flashcards/generate", payload);
  return res.data;
};
