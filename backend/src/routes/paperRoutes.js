const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { addPaperSchema } = require('../validators/researchValidators');

router.get('/', requireAuth, paperController.getPapersByProject);
router.post('/', requireAuth, validate(addPaperSchema), paperController.addPaper);
router.get('/:id', requireAuth, paperController.getPaperById);
router.delete('/:id', requireAuth, paperController.deletePaper);

module.exports = router;
