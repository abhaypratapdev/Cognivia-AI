import Window from "./Window";
import SmartPDFViewer from "../SmartPDFViewer";

export default function WindowManager({ windows, setWindows }) {
  const closeWindow = (id) =>
    setWindows((prev) => prev.filter((w) => w.id !== id));

  const updateWindow = (id, updates) =>
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updates } : w))
    );

  return (
    <>
      {windows.map((win) => (
        <Window
          key={win.id}
          data={win}
          onClose={closeWindow}
          onUpdate={updateWindow}
        >
          {win.type === "pdf" && (
            <SmartPDFViewer
              fileUrl={win.fileUrl}
              fileId={win.fileId}
            />
          )}

          {win.type === "image" && (
            <img
              src={win.fileUrl}
              className="w-full h-full object-contain p-2"
              alt="preview"
            />
          )}

          {win.type === "notes" && (
            <textarea
              className="w-full h-full p-4 resize-none outline-none"
              placeholder="Write your notes here..."
            />
          )}
        </Window>
      ))}
    </>
  );
}