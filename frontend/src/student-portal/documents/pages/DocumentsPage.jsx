import React, { useEffect, useState } from "react";
import { documentService } from "../services/document.service";
import { Upload, File, CheckCircle2, Clock, FileTerminal } from "lucide-react";
import { useForm } from "react-hook-form";
import { Trash2, Download, Eye, FileText } from "lucide-react";

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();
  const [uploading, setUploading] = useState(false);

  // const REQUIRED_DOCUMENTS = [
  //   "AADHAR_CARD",
  //   "PHOTO",
  //   "TENTH_MARKSHEET",
  //   "TWELFTH_MARKSHEET",
  //   "CHARACTER_CERTIFICATE",
  //   "TRANSFER_CERTIFICATE",
  // ];

  // const uploadedTypes = documents.map((doc) => doc.type);

  async function fetchDocs() {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  const onUpload = async (data) => {
    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("title", data.title);
      formData.append("type", data.type);
      formData.append("file", data.file[0]);

      await documentService.uploadDocument(formData);

      reset();

      fetchDocs();
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await documentService.deleteDocument(id);
      fetchDocs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 max-w-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Upload Document
          </h2>
          <p className="text-sm text-gray-500">
            Submit required documents for your admission.
          </p>
        </div>
        <form onSubmit={handleSubmit(onUpload)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Title
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. High School Transcript"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                {...register("type", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="TENTH_MARKSHEET">10th Marksheet</option>

                <option value="TWELFTH_MARKSHEET">12th Marksheet</option>

                <option value="SEMESTER_MARKSHEET">Semester Marksheet</option>

                <option value="AADHAR_CARD">Aadhar Card</option>

                <option value="PAN_CARD">PAN Card</option>

                <option value="PASSPORT">Passport</option>

                <option value="TRANSFER_CERTIFICATE">
                  Transfer Certificate
                </option>

                <option value="CHARACTER_CERTIFICATE">
                  Character Certificate
                </option>

                <option value="PHOTO">Photograph</option>

                <option value="OTHER">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select File
              </label>

              <input
                type="file"
                {...register("file", { required: true })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                accept=".pdf,.jpg,.jpeg,.png"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? "Uploading..." : "Upload Document"}
          </button>
        </form>
      </div>

      {/* Documents Tracker
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold mb-4">
          Required Documents Tracker
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REQUIRED_DOCUMENTS.map((docType) => {
            const uploaded = uploadedTypes.includes(docType);

            return (
              <div
                key={docType}
                className={`p-4 rounded-lg border ${
                  uploaded
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {docType.replaceAll("_", " ")}
                  </span>

                  <span
                    className={`font-semibold ${
                      uploaded ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {uploaded ? "✓ Uploaded" : "✗ Missing"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div> */}

      {/* Documents List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          My Documents
        </h2>
        {loading ? (
          <div>Loading documents...</div>
        ) : documents.length === 0 ? (
          <div className="text-gray-500 text-sm text-center py-8">
            No documents uploaded yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3 font-medium">Preview</th>
                  <th className="px-6 py-3 font-medium">Document</th>
                  <th className="px-6 py-3 font-medium">Type</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Date Uploaded</th>
                  <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">
                      {doc.fileUrl.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                        <img
                          src={`http://localhost:5050${doc.fileUrl}`}
                          alt="preview"
                          className="w-12 h-12 rounded-lg object-cover border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                          <FileText size={15} className="text-red-600" />
                        </div>
                      )}
                    </td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {doc.title}
                    </td>

                    <td className="px-6 py-4">
                      {doc.type.replaceAll("_", " ")}
                    </td>

                    <td className="px-6 py-4">
                      {doc.status === "APPROVED" ? (
                        <span className="flex items-center text-green-600">
                          <CheckCircle2 className="h-4 w-4 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="flex items-center text-amber-600">
                          <Clock className="h-4 w-4 mr-1" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {new Date(doc.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            window.open(
                              `http://localhost:5050${doc.fileUrl}`,
                              "_blank",
                            )
                          }
                          className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          <Eye size={16} />
                        </button>

                        <a
                          href={`http://localhost:5050${doc.fileUrl}`}
                          download
                          className="p-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          <Download size={16} />
                        </a>

                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentsPage;
