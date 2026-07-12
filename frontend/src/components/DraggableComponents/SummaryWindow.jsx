export default function SummaryWindow({ file }) {
  return (
    <div className="p-4 text-gray-800">
      <h2 className="text-lg font-semibold mb-2">
        Summary – {file.filename}
      </h2>

      <p className="text-sm text-gray-600">
        This is where AI summary will appear.
      </p>
    </div>
  );
}