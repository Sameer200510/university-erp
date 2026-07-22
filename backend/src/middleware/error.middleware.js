const AppError = require("../utils/AppError");

const handlePrismaError = (err) => {
  if (err.code === "P2002") {
    const target = err.meta && err.meta.target ? err.meta.target : "field";
    const message = `Duplicate field value entered for ${target}. Please use another value.`;
    return new AppError(message, 400);
  }
  if (err.code === "P2003") {
    return new AppError("Invalid reference to related database record.", 400);
  }
  if (err.code === "P2025") {
    return new AppError("Requested record not found in database.", 404);
  }
  return new AppError("Database query failed.", 500);
};

const handleJWTError = () =>
  new AppError("Invalid authentication token. Please log in again.", 401);

const handleJWTExpiredError = () =>
  new AppError("Your session token has expired. Please log in again.", 401);

const handleMulterError = (err) => {
  if (err.code === "LIMIT_FILE_SIZE") {
    return new AppError("File size too large. Maximum allowed size exceeded.", 400);
  }
  return new AppError(err.message || "File upload error occurred.", 400);
};

const sendErrorDev = (err, res) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    status: err.status || "error",
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || 500;

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      status: err.status || "error",
      message: err.message,
    });
  }

  // Programming or other unknown error: don't leak error details
  console.error("ERROR 💥:", err);
  return res.status(500).json({
    success: false,
    status: "error",
    message: "Something went wrong on the server.",
  });
};

const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;
    error.code = err.code;

    if (error.code && typeof error.code === "string" && error.code.startsWith("P2")) {
      error = handlePrismaError(error);
    }
    if (error.name === "JsonWebTokenError") error = handleJWTError();
    if (error.name === "TokenExpiredError") error = handleJWTExpiredError();
    if (error.name === "MulterError") error = handleMulterError(error);

    sendErrorProd(error, res);
  } else {
    sendErrorDev(err, res);
  }
};

module.exports = errorHandler;
