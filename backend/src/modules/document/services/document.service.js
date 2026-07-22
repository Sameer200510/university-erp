const documentRepository = require("../repositories/document.repository");

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
    return await documentRepository.deleteDocument(id, userId);
  }
}

module.exports = new DocumentService();
