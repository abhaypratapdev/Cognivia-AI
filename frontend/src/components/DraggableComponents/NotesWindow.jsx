import { useState } from "react";

export default function NotesWindow({ file }) {
  const [notes, setNotes] = useState("");

  return (
    <div className="p-4 h-full flex flex-col">
      <h2 className="font-semibold mb-2">Notes – {file.filename}</h2>

      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="flex-1 p-2 border rounded resize-none"
      />
    </div>
  );
}