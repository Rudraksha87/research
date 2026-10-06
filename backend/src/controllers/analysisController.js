const { supabase, isConfigured, memoryStore } = require('../config/supabase');

const getAnalysisByPaperId = async (req, res) => {
  try {
    const { paperId } = req.params;
    let analysis = null;

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('paper_analyses').select('*').eq('paper_id', paperId).single();
      if (!error && data) analysis = data;
    } else {
      analysis = memoryStore.paper_analyses.find(a => a.paper_id === paperId);
    }

    if (!analysis) {
      // Default placeholder analysis if not yet run
      return res.status(200).json({
        success: true,
        analysis: {
          paper_id: paperId,
          methodology: 'Analysis pending or underway in background pipeline.',
          datasets_used: [],
          sample_size: 'N/A',
          main_contributions: ['Baseline evaluation'],
          strengths: ['Rigorous experimental structure'],
          limitations: ['Pending deep decomposition'],
          relevance_score: 8,
          summary: 'Pending analysis generation.'
        }
      });
    }

    return res.status(200).json({ success: true, analysis });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getComparisonByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    let comparison = null;

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('paper_comparisons').select('*').eq('project_id', projectId).single();
      if (!error && data) comparison = data;
    } else {
      comparison = memoryStore.paper_comparisons.find(c => c.project_id === projectId);
    }

    if (!comparison) {
      return res.status(200).json({
        success: true,
        comparison: {
          project_id: projectId,
          matrix_data: [],
          comparison_summary: 'No comparison matrix synthesized yet for this project.',
          key_tradeoffs: []
        }
      });
    }

    return res.status(200).json({ success: true, comparison });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getGapsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    let gaps = [];

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('research_gaps').select('*').eq('project_id', projectId);
      if (error) throw error;
      gaps = data || [];
    } else {
      gaps = memoryStore.research_gaps.filter(g => g.project_id === projectId);
    }

    return res.status(200).json({ success: true, gaps });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getFutureDirectionsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    let directions = [];

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('future_directions').select('*').eq('project_id', projectId);
      if (error) throw error;
      directions = data || [];
    } else {
      directions = memoryStore.future_directions.filter(d => d.project_id === projectId);
    }

    return res.status(200).json({ success: true, directions });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getReportByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    let report = null;

    if (isConfigured && supabase) {
      const { data, error } = await supabase.from('reports').select('*').eq('project_id', projectId).order('created_at', { ascending: false }).limit(1).single();
      if (!error && data) report = data;
    } else {
      report = memoryStore.reports.find(r => r.project_id === projectId);
    }

    if (!report) {
      return res.status(200).json({
        success: true,
        report: {
          project_id: projectId,
          title: 'Synthesis in Progress',
          executive_summary: 'Report compilation is in progress.',
          markdown_content: 'Report generation has not been triggered yet.',
          table_of_contents: []
        }
      });
    }

    return res.status(200).json({ success: true, report });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAnalysisByPaperId,
  getComparisonByProjectId,
  getGapsByProjectId,
  getFutureDirectionsByProjectId,
  getReportByProjectId
};
