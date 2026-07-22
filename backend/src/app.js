const helmet = require("helmet");
const express = require("express");
const cors = require("cors");
const path = require("path");
const errorHandler = require("./middleware/error.middleware");
const { apiLimiter } = require("./middleware/rateLimiter.middleware");

const authRoutes = require("./modules/auth/routes/auth.routes");
const studentRoutes = require("./modules/student/routes/student.routes");
const documentRoutes = require("./modules/document/routes/document.routes");
const admissionRoutes = require("./modules/admission/routes/admission.routes");
const academicRoutes = require("./modules/academic/routes/academic.routes");
const storageRoutes = require("./modules/storage/routes/storage.routes");
const semesterRegistrationRoutes = require("./modules/semester-registration/routes/semesterRegistration.routes");
const feedbackRoutes = require("./modules/feedback/routes/feedback.routes");
const feesRoutes = require("./modules/fees/routes/fees.routes");

const admitCardRoutes = require("./modules/admit-card/routes/admitCard.routes");
const examRoutes = require("./modules/exam/routes/exam.routes");
const revaluationRoutes = require("./modules/revaluation/routes/revaluation.routes");
const circularRoutes = require("./modules/circular/routes/circular.routes");
const leadRoutes = require("./modules/erp-leads/routes/lead.routes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3000"],
    credentials: true,
  }),
);


app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  "/uploads",
  express.static(path.join(__dirname, "../uploads"), {
    setHeaders: (res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("X-Content-Type-Options", "nosniff");
    },
  }),
);

app.use("/api", apiLimiter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "University ERP Backend Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/document", documentRoutes);
app.use("/api/admission", admissionRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/storage", storageRoutes);
app.use("/api/semester-registration", semesterRegistrationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/admit-card", admitCardRoutes);
app.use("/api/exam", examRoutes);
app.use("/api/revaluation", revaluationRoutes);
app.use("/api/circular", circularRoutes);
app.use("/api/leads", leadRoutes);
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;
