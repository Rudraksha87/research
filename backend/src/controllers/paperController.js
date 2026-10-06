const { v4: uuidv4 } = require('uuid');
const { supabase, isConfigured, memoryStore } = require('../config/supabase');

const getPapersByProject = async (req, res) => {
  try {
    const { projectId } = req.query;
    if (!projectId) {
      return res.status(400).json({ success: false, message: 'projectId query parameter is required.' });
    }

    let papers = [];
    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('papers')
        .select('*')
        .eq('project_id', projectId)
        .order('score', { ascending: false });
      if (error) throw error;
      papers = data || [];
    } else {
      papers = memoryStore.papers.filter(p => p.project_id === projectId);
    }

    return res.status(200).json({ success: true, papers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPaperById = async (req, res) => {
  try {
    const { id } = req.params;
    let paper = null;

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('papers').select('*').eq('id', id).single();
      if (error) throw error;
      paper = data;
    } else {
      paper = memoryStore.papers.find(p => p.id === id);
    }

    if (!paper) {
      return res.status(404).json({ success: false, message: 'Paper not found.' });
    }

    return res.status(200).json({ success: true, paper });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const addPaper = async (req, res) => {
  try {
    const { projectId, title, authors, abstract, year, journalOrVenue, doi, url, citationCount, source } = req.body;

    const newPaper = {
      id: uuidv4(),
      project_id: projectId,
      title,
      authors: authors || [],
      abstract: abstract || '',
      year: year || new Date().getFullYear(),
      journal_or_venue: journalOrVenue || 'Manual Entry',
      doi: doi || '',
      url: url || '',
      citation_count: citationCount || 0,
      source: source || 'Manual',
      score: 8.5,
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      const { error } = await supabase.from('papers').insert([newPaper]);
      if (error) throw error;
    } else {
      memoryStore.papers.unshift(newPaper);
    }

    return res.status(201).json({ success: true, paper: newPaper });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deletePaper = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured && supabase) {
      const { error } = await supabase.from('papers').delete().eq('id', id);
      if (error) throw error;
    } else {
      memoryStore.papers = memoryStore.papers.filter(p => p.id !== id);
    }

    return res.status(200).json({ success: true, message: 'Paper deleted.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getPapersByProject,
  getPaperById,
  addPaper,
  deletePaper
};
