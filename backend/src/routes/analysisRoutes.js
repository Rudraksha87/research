const express = require('express');
const router = express.Router();
const analysisController = require('../controllers/analysisController');
const { requireAuth } = require('../middleware/authMiddleware');

router.get('/paper/:paperId', requireAuth, analysisController.getAnalysisByPaperId);
router.get('/comparison/:projectId', requireAuth, analysisController.getComparisonByProjectId);
router.get('/gaps/:projectId', requireAuth, analysisController.getGapsByProjectId);
router.get('/future/:projectId', requireAuth, analysisController.getFutureDirectionsByProjectId);
router.get('/report/:projectId', requireAuth, analysisController.getReportByProjectId);

module.exports = router;
