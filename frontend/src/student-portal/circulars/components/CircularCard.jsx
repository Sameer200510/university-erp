function CircularCard({ circular }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-gray-800">{circular.title}</h2>

        {circular.isPinned && (
          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
            📌 Pinned
          </span>
        )}
      </div>

      <div className="flex gap-3 mb-4">
        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
          {circular.category}
        </span>

        <span className="text-gray-500 text-sm">
          {new Date(circular.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-gray-700 mb-4">{circular.description}</p>

      {circular.attachmentUrl && (
        <a
          href={`http://localhost:5050${circular.attachmentUrl}`}
          target="_blank"
          rel="noreferrer"
          className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          Download Attachment
        </a>
      )}
    </div>
  );
}

export default CircularCard;
