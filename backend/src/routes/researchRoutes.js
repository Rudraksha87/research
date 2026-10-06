const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');
const { requireAuth } = require('../middleware/authMiddleware');
const { validate } = require('../middleware/validationMiddleware');
const { createResearchSchema } = require('../validators/researchValidators');

// Base project routes
router.get('/', requireAuth, researchController.getProjects);
router.post('/', requireAuth, validate(createResearchSchema), researchController.createProject);
router.get('/:id', requireAuth, researchController.getProjectById);
router.delete('/:id', requireAuth, researchController.deleteProject);

// Research workflow stage routes (Section 28 API Design)
router.post('/:id/search', requireAuth, researchController.searchProjectPapers);
router.post('/:id/analyze', requireAuth, researchController.analyzeProjectPapers);
router.post('/:id/compare', requireAuth, researchController.compareProjectPapers);
router.post('/:id/gaps', requireAuth, researchController.detectProjectGaps);
router.post('/:id/future', requireAuth, researchController.formulateProjectFuture);
router.post('/:id/report', requireAuth, researchController.generateProjectReport);

// All-in-one execution pipeline
router.post('/:id/execute', requireAuth, researchController.executePipeline);

module.exports = router;
