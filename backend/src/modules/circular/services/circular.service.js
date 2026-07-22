const repository = require("../repositories/circular.repository");

async function getAllCirculars() {
  return repository.getAll();
}

async function getCircular(id) {
  return repository.getById(id);
}

async function createCircular(userId, body) {
  return repository.create({
    title: body.title,
    description: body.description,
    category: body.category,
    attachmentUrl: body.attachmentUrl || null,
    isPinned: body.isPinned || false,
    createdBy: userId,
  });
}

module.exports = {
  getAllCirculars,
  getCircular,
  createCircular,
};
