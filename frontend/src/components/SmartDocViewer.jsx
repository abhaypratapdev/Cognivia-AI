export default function SmartDocViewer({ fileUrl }) {
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    fileUrl
  )}&embedded=true`;

  return (
    <iframe
      src={viewerUrl}
      className="w-full h-full border-none rounded-lg"
      title="Document Viewer"
    />
  );
}