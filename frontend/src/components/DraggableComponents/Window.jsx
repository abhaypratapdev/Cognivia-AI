import { useState, useRef, useEffect } from "react";
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiGrid,
  FiColumns,
  FiMoreVertical,
  FiFileText,
  FiEdit,
  FiHelpCircle,
  FiLayers,
} from "react-icons/fi";
import { Rnd } from "react-rnd";

export default function Window({
  data,
  onClose,
  onUpdate,
  onAction,
  children,
}) {
  const { id, title, position, size, maximized } = data;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const close = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <Rnd
      size={maximized ? { width: "100%", height: "100%" } : size}
      position={maximized ? { x: 0, y: 0 } : position}
      enableResizing={!maximized}
      dragHandleClassName="window-header"
      bounds="parent"
      onDragStop={(e, d) => onUpdate(id, { position: d })}
      onResizeStop={(e, dir, ref, delta, pos) =>
        onUpdate(id, {
          size: { width: ref.offsetWidth, height: ref.offsetHeight },
          position: pos,
        })
      }
      className="absolute z-40 bg-white dark:bg-gray-900 rounded-lg shadow-xl"
    >
      {/* HEADER */}
      <div className="window-header flex items-center justify-between px-3 py-2 bg-gray-800 text-white select-none">
        <span className="truncate font-medium">{title}</span>

        <div className="flex items-center gap-2 relative">
          {/* Dropdown menu */}
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <FiMoreVertical />
          </button>

          {menuOpen && (
            <div
              ref={menuRef}
              className="absolute right-0 top-9 w-44 bg-gray-900 border border-gray-700 rounded shadow-lg z-50"
            >
              <button
                onClick={() => onAction("notes", data)}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700"
              >
                <FiEdit /> Notes
              </button>

              <button
                onClick={() => onAction("quiz", data)}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700"
              >
                <FiHelpCircle /> Quiz
              </button>

              <button
                onClick={() => onAction("flashcards", data)}
                className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-700"
              >
                <FiLayers /> Flashcards
              </button>
            </div>
          )}
          {/* Summarize (in-window) - only enabled when text extracted */}
          <button
            onClick={() => onAction && onAction("generateSummary", data, id)}
            disabled={data.ocrPending || data.summaryPending || data.summaryLoading}
            className={`p-1 rounded ${
              data.ocrPending || data.summaryPending || data.summaryLoading
                ? "opacity-50 cursor-not-allowed bg-gray-700"
                : "hover:bg-gray-700"
            }`}
            title={
              data.ocrPending
                ? "Extracting text..."
                : data.summaryPending || data.summaryLoading
                ? "Generating summary..."
                : "Generate Summary"
            }
          >
            Sum
          </button>

          {/* Layout buttons */}
          <button
            onClick={() => onUpdate("SPLIT_HORIZONTAL")}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <FiColumns />
          </button>

          <button
            onClick={() => onUpdate("GRID_ALL")}
            className="p-1 hover:bg-gray-700 rounded"
          >
            <FiGrid />
          </button>

          {/* Maximize */}
          <button
            onClick={() => onUpdate(id, { maximized: !maximized })}
            className="p-1 hover:bg-gray-700 rounded"
          >
            {maximized ? <FiMinimize2 /> : <FiMaximize2 />}
          </button>

          {/* Close */}
          <button
            onClick={() => onClose(id)}
            className="p-1 hover:bg-red-600 rounded"
          >
            <FiX />
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="h-[calc(100%-42px)] overflow-auto">{children}</div>
    </Rnd>
  );
}
