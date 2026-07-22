const express = require('express');
const router = express.Router();
const leadController = require('../controllers/lead.controller');

// Middlewares
const { verifyToken } = require('../../../middleware/auth.middleware');
const { authorizeRole } = require('../../../middleware/role.middleware');
const validate = require('../../../middleware/validation.middleware');
const { applyLeadValidation, updatePaymentValidation } = require('../validators/lead.validator');
const rateLimit = require('express-rate-limit');
const uploadDocument = require('../../../middleware/uploadDocument.middleware');

// Rate limiters
const applyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Increased for testing
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many applications from this IP, please try again after 15 minutes.' }
});

// Public endpoints
router.post('/apply', applyLimiter, applyLeadValidation, validate, leadController.createLead);
router.post('/:id/documents', uploadDocument.single('file'), leadController.uploadDocument);
router.get('/:id', leadController.getLead);

// Admin endpoints
router.use(verifyToken);
router.get('/', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER', 'FINANCE_OFFICER'), leadController.getLeads);
router.post('/finance/process-payment', authorizeRole('SUPER_ADMIN', 'FINANCE_OFFICER'), leadController.processFinancePayment);
router.post('/:id/finance-pay', authorizeRole('SUPER_ADMIN', 'FINANCE_OFFICER'), leadController.processFinancePayment);
router.post('/:id/approve', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER'), leadController.approveLead);
router.put('/:id/status', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER'), leadController.updateStatus);
router.patch('/:id/payment', authorizeRole('SUPER_ADMIN', 'ADMISSION_OFFICER', 'FINANCE_OFFICER'), updatePaymentValidation, validate, leadController.updatePayment);

module.exports = router;