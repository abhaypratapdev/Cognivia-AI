import { Rnd } from "react-rnd";
import { FiX } from "react-icons/fi";
import { useState } from "react";

export default function DraggableWindow({
  title,
  children,
  onClose,
  defaultSize = { width: 800, height: 600 },
}) {
  const screenW = typeof window !== "undefined" ? window.innerWidth : 1200;
  const screenH = typeof window !== "undefined" ? window.innerHeight : 800;

  const clamp = (x, y, w, h) => {
    const width = Math.min(w, screenW);
    const height = Math.min(h, screenH);
    const nx = Math.max(0, Math.min(x, Math.max(0, screenW - width)));
    const ny = Math.max(0, Math.min(y, Math.max(0, screenH - height)));
    return { x: nx, y: ny, width, height };
  };

  const initial = clamp(120, 80, defaultSize.width, defaultSize.height);

  const [pos, setPos] = useState({ x: initial.x, y: initial.y });
  const [size, setSize] = useState({
    width: initial.width,
    height: initial.height,
  });

  return (
    <Rnd
      size={{ width: size.width, height: size.height }}
      position={{ x: pos.x, y: pos.y }}
      minWidth={300}
      minHeight={300}
      bounds="window"
      dragHandleClassName="window-header"
      enableResizing
      onDragStop={(e, d) => {
        const cl = clamp(d.x, d.y, size.width, size.height);
        setPos({ x: cl.x, y: cl.y });
      }}
      onResizeStop={(e, dir, ref, delta, position) => {
        const w = Math.min(ref.offsetWidth, screenW);
        const h = Math.min(ref.offsetHeight, screenH);
        const maxX = Math.max(0, screenW - w);
        const maxY = Math.max(0, screenH - h);
        const nx = Math.max(0, Math.min(position.x, maxX));
        const ny = Math.max(0, Math.min(position.y, maxY));
        setSize({ width: w, height: h });
        setPos({ x: nx, y: ny });
      }}
    >
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-xl flex flex-col border">
        {/* HEADER (Drag from here) */}
        <div className="window-header cursor-move flex items-center justify-between px-4 py-2 bg-blue-600 text-white rounded-t-lg">
          <span className="font-semibold truncate">{title}</span>
          <button onClick={onClose} className="hover:text-red-200">
            Close
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </div>
    </Rnd>
  );
}
