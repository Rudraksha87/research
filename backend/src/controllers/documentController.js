const { v4: uuidv4 } = require('uuid');
const { parseDocument } = require('../services/documents/documentAnalysisService');
const { supabase, isConfigured, memoryStore } = require('../config/supabase');
const { logInfo } = require('../utils/logger');

const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const { projectId } = req.body;
    const userId = req.user.id;

    logInfo(`Processing uploaded document: ${req.file.originalname} (${req.file.size} bytes)`);

    const { text, metadata, analysis } = await parseDocument(req.file.path, req.file.mimetype);

    const docRecord = {
      id: uuidv4(),
      user_id: userId,
      project_id: projectId || null,
      filename: req.file.originalname,
      file_path: req.file.path,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      extracted_text: text,
      parsed_metadata: metadata,
      analysis: analysis,
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      await supabase.from('document_uploads').insert([docRecord]);
    } else {
      memoryStore.document_uploads.push(docRecord);
    }

    // If linked to a project, also register as a paper in that project
    let createdPaper = null;
    if (projectId) {
      createdPaper = {
        id: uuidv4(),
        project_id: projectId,
        title: metadata.title || req.file.originalname,
        authors: metadata.authors || ['Uploaded Author'],
        abstract: metadata.abstract || text.slice(0, 300),
        year: metadata.year || new Date().getFullYear(),
        journal_or_venue: metadata.venue || 'User Document Upload',
        doi: '',
        url: '',
        citation_count: 0,
        source: 'Upload',
        score: 9.0,
        analysis: analysis,
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('papers').insert([createdPaper]);
      } else {
        memoryStore.papers.unshift(createdPaper);
      }
    }

    return res.status(201).json({
      success: true,
      message: 'Document uploaded and analyzed successfully.',
      document: docRecord,
      analysis: analysis,
      paper: createdPaper
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;
    let documents = [];

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('document_uploads').select('*').eq('user_id', userId);
      if (error) throw error;
      documents = data || [];
    } else {
      documents = memoryStore.document_uploads.filter(d => d.user_id === userId);
    }

    return res.status(200).json({ success: true, documents });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  uploadDocument,
  getDocuments
};
