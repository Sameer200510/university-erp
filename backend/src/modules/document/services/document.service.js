const fs = require("fs");
const path = require("path");
const documentRepository = require("../repositories/document.repository");
const AppError = require("../../../utils/AppError");

class DocumentService {
  async getUserDocuments(userId) {
    return await documentRepository.getDocumentsByUserId(userId);
  }

  async uploadDocument(userId, title, type, fileUrl) {
    return await documentRepository.upsertDocument(
      userId,
      title,
      type,
      fileUrl,
    );
  }

  async deleteDocument(id, userId) {
    const doc = await documentRepository.getDocumentById(id, userId);
    if (!doc) {
      throw new AppError("Document not found or unauthorized", 404);
    }

    if (doc.fileUrl && doc.fileUrl.startsWith("/uploads")) {
      const filePath = path.join(__dirname, "../../../../", doc.fileUrl);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (e) {
          console.error("Error unlinking document file:", e);
        }
      }
    }

    return await documentRepository.deleteDocument(id, userId);
  }
}

module.exports = new DocumentService();
