const documentService = require("../services/document.service");

class DocumentController {
  async getMyDocuments(req, res) {
    try {
      const userId = req.user.id;
      const documents = await documentService.getUserDocuments(userId);
      res.status(200).json({ documents });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async uploadDocument(req, res) {
    try {
      const userId = req.user.id;

      const { title, type } = req.body;

      if (!req.file) {
        return res.status(400).json({
          message: "File required",
        });
      }

      const fileUrl = `/uploads/documents/${req.file.filename}`;

      const document = await documentService.uploadDocument(
        userId,
        title,
        type,
        fileUrl,
      );

      res.status(201).json({
        message: "Document uploaded",
        document,
      });
    } catch (error) {
      res.status(400).json({
        message: error.message,
      });
    }
  }

  async deleteDocument(req, res) {
    try {
      const userId = req.user.id;
      const { id } = req.params;

      await documentService.deleteDocument(id, userId);

      res.status(200).json({
        message: "Document deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
      });
    }
  }
}

module.exports = new DocumentController();
