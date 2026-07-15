import { FiX, FiFile } from "react-icons/fi";
import { useMemo, useState } from "react";

export default function FilesModal({ files, onClose, onSelect }) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("all");

  const filteredFiles = useMemo(() => {
    return files.filter((file) => {
      const matchesSearch = file.filename
        ?.toLowerCase()
        .includes(search.toLowerCase());

      const matchesType =
        type === "all" ||
        (type === "pdf" && file.fileType === "application/pdf") ||
        (type === "image" && file.fileType?.startsWith("image/"));

      return matchesSearch && matchesType;
    });
  }, [files, search, type]);

  return (
    <div className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center">
      <div className="bg-white rounded w-[600px] max-h-[80vh] overflow-auto p-4">
        <div className="flex justify-between mb-3">
          <h2 className="text-xl font-bold">All Files</h2>
          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="flex gap-2 mb-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files"
            className="flex-1 border rounded px-3 py-2"
          />
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All</option>
            <option value="pdf">PDF</option>
            <option value="image">Image</option>
          </select>
        </div>

        {filteredFiles.length === 0 && <p>No files</p>}

        {filteredFiles.map((file) => (
          <div
            key={file._id}
            onClick={() => {
              onSelect(file);
              onClose();
            }}
            className="flex items-center gap-3 p-2 border-b cursor-pointer hover:bg-gray-100"
          >
            <FiFile />
            <span className="truncate">{file.filename}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
