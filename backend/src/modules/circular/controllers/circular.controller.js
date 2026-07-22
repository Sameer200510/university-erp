const service = require("../services/circular.service");

async function getAllCirculars(req, res) {
  const data = await service.getAllCirculars();

  res.json({
    success: true,
    data,
  });
}

async function getCircular(req, res) {
  const data = await service.getCircular(req.params.id);

  res.json({
    success: true,
    data,
  });
}

async function createCircular(req, res, next) {
  try {
    const data = await service.createCircular(req.user.id, req.body);

    res.json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createCircular,
};

module.exports = {
  getAllCirculars,
  getCircular,
  createCircular,
};
