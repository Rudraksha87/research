const express = require('express');
const router = express.Router();
const documentController = require('../controllers/documentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { upload } = require('../middleware/uploadMiddleware');

router.post('/upload', requireAuth, upload.single('file'), documentController.uploadDocument);
router.get('/', requireAuth, documentController.getDocuments);

module.exports = router;
