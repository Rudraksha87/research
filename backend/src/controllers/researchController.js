const { v4: uuidv4 } = require('uuid');
const { supabase, isConfigured, memoryStore } = require('../config/supabase');
const { createResearchPlan } = require('../services/ai/researchPlanner');
const { searchPapers } = require('../services/research/paperSearchService');
const { deduplicatePapers } = require('../services/research/duplicateRemovalService');
const { rankPapers } = require('../services/research/paperRankingService');
const { analyzePaper } = require('../services/ai/paperAnalysis');
const { comparePapers } = require('../services/ai/paperComparison');
const { detectResearchGaps } = require('../services/ai/researchGapDetector');
const { formulateFutureDirections } = require('../services/ai/futureResearch');
const { generateSynthesisReport } = require('../services/ai/reportGenerator');
const { logInfo, logError } = require('../utils/logger');

// Helper to retrieve project by ID
const findProject = async (id, userId) => {
  if (isConfigured && supabase) {
    const { data } = await supabase.from('research_projects').select('*').eq('id', id).single();
    return data;
  }
  return memoryStore.research_projects.find(p => p.id === id);
};

// Helper to update project status
const updateProject = async (id, updates) => {
  if (isConfigured && supabase) {
    await supabase.from('research_projects').update(updates).eq('id', id);
  } else {
    const proj = memoryStore.research_projects.find(p => p.id === id);
    if (proj) Object.assign(proj, updates);
  }
};

const getProjects = async (req, res) => {
  try {
    const userId = req.user.id;
    let projects = [];

    if (isConfigured && supabase) {
      const { data, error } = await supabase
        .from('research_projects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      projects = data || [];
    } else {
      projects = memoryStore.research_projects.filter(
        p => p.user_id === userId || p.user_id === 'a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d'
      );
    }

    return res.status(200).json({ success: true, projects });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project = await findProject(id, req.user?.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Research project not found.' });
    }

    return res.status(200).json({ success: true, project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const createProject = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, query, domain, paperCount, depth, includeSearch } = req.body;

    const researchQuery = query || title;
    const projectTitle = title || researchQuery;
    const targetPaperCount = paperCount || 10;

    logInfo(`Formulating new research plan: "${projectTitle}"`);
    const plan = await createResearchPlan(projectTitle, researchQuery, domain);

    const newProject = {
      id: uuidv4(),
      user_id: userId,
      title: projectTitle,
      query: researchQuery,
      domain: domain || 'Agriculture & Computer Science',
      paperCount: targetPaperCount,
      depth: depth || 'Standard',
      status: includeSearch ? 'running' : 'draft',
      plan,
      summary: plan.hypothesis || 'Initial research strategy established.',
      key_findings: [],
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      const { error } = await supabase.from('research_projects').insert([newProject]);
      if (error) throw error;
    } else {
      memoryStore.research_projects.unshift(newProject);
    }

    if (includeSearch) {
      // Trigger execution in background or immediately
      setTimeout(() => {
        executePipelineInternal(newProject.id, userId).catch(err => logError('Background pipeline error:', err));
      }, 50);
    }

    return res.status(201).json({
      success: true,
      message: 'Research session initialized successfully.',
      project: newProject
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 1. Stage endpoint: POST /api/research/:id/search
const searchProjectPapers = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    const queries = project.plan?.searchQueries || project.plan?.searchTerms || [project.query, project.title];
    const targetLimit = project.paperCount || 10;

    const rawPapers = await searchPapers(queries, project.domain, targetLimit);
    const uniquePapers = deduplicatePapers(rawPapers);
    const rankedPapers = rankPapers(uniquePapers, project.query, project.plan?.targetMetrics || []);

    const createdPapers = [];
    for (const p of rankedPapers) {
      const paperRecord = {
        id: uuidv4(),
        project_id: id,
        title: p.title,
        authors: p.authors || [],
        abstract: p.abstract || '',
        year: p.year || new Date().getFullYear(),
        journal_or_venue: p.journal_or_venue || p.source || 'Academic Publication',
        doi: p.doi || '',
        url: p.url || '',
        citation_count: p.citationCount || p.citation_count || 0,
        source: p.source || 'arXiv',
        score: p.score || 8.5,
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('papers').insert([paperRecord]);
      } else {
        memoryStore.papers.unshift(paperRecord);
      }
      createdPapers.push(paperRecord);
    }

    await updateProject(id, { status: 'papers_retrieved' });

    return res.status(200).json({
      success: true,
      message: `Retrieved and indexed ${createdPapers.length} academic papers.`,
      papers: createdPapers
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Stage endpoint: POST /api/research/:id/analyze
const analyzeProjectPapers = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    let papers = [];
    if (isConfigured && supabase) {
      const { data } = await supabase.from('papers').select('*').eq('project_id', id);
      papers = data || [];
    } else {
      papers = memoryStore.papers.filter(p => p.project_id === id);
    }

    if (papers.length === 0) {
      return res.status(400).json({ success: false, message: 'No papers found to analyze. Run search first.' });
    }

    const analyses = [];
    for (const paper of papers) {
      const analysis = await analyzePaper(paper, project.query);
      const analysisRecord = {
        id: uuidv4(),
        paper_id: paper.id,
        project_id: id,
        methodology: analysis.methodology,
        datasets_used: [analysis.dataset || 'Curated benchmark'],
        sample_size: 'Standard test partitions',
        main_contributions: analysis.main_contributions || [analysis.keyFindings || 'Core contribution'],
        strengths: analysis.strengths || [analysis.results || 'Robust performance'],
        limitations: analysis.limitations_list || [analysis.limitations || 'Testing constraints'],
        relevance_score: analysis.relevance_score || 9,
        summary: analysis.summary || '',
        // Include Section 9 exact fields
        researchProblem: analysis.researchProblem,
        objective: analysis.objective,
        dataset: analysis.dataset,
        keyFindings: analysis.keyFindings,
        results: analysis.results,
        futureWork: analysis.futureWork,
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('paper_analyses').insert([analysisRecord]);
      } else {
        // Update paper in memory with analysis
        paper.analysis = analysisRecord;
        memoryStore.paper_analyses.unshift(analysisRecord);
      }
      analyses.push(analysisRecord);
    }

    await updateProject(id, { status: 'analyzed' });

    return res.status(200).json({
      success: true,
      message: `Analyzed ${analyses.length} papers.`,
      analyses
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Stage endpoint: POST /api/research/:id/compare
const compareProjectPapers = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    let papers = [];
    if (isConfigured && supabase) {
      const { data } = await supabase.from('papers').select('*').eq('project_id', id);
      papers = data || [];
    } else {
      papers = memoryStore.papers.filter(p => p.project_id === id);
    }

    const comparisonResult = await comparePapers(papers, project.query);
    const comparisonRecord = {
      id: uuidv4(),
      project_id: id,
      matrix_data: comparisonResult.matrix_data || [],
      comparison_table: comparisonResult.comparison_table || [],
      insights: comparisonResult.insights || {},
      comparison_summary: comparisonResult.comparison_summary || '',
      key_tradeoffs: comparisonResult.key_tradeoffs || [],
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      await supabase.from('paper_comparisons').insert([comparisonRecord]);
    } else {
      memoryStore.paper_comparisons.unshift(comparisonRecord);
    }

    await updateProject(id, { status: 'compared' });

    return res.status(200).json({
      success: true,
      message: 'Cross-paper comparison synthesized.',
      comparison: comparisonRecord
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Stage endpoint: POST /api/research/:id/gaps
const detectProjectGaps = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    let papers = [];
    if (isConfigured && supabase) {
      const { data } = await supabase.from('papers').select('*').eq('project_id', id);
      papers = data || [];
    } else {
      papers = memoryStore.papers.filter(p => p.project_id === id);
    }

    const gapsResult = await detectResearchGaps(papers, project.query);
    const createdGaps = [];

    for (const g of gapsResult) {
      const gapRecord = {
        id: uuidv4(),
        project_id: id,
        title: g.title,
        category: g.category || 'Generalizability',
        explanation: g.explanation || g.description,
        description: g.explanation || g.description,
        whyItMatters: g.whyItMatters || '',
        evidence: g.evidence || `${Math.min(papers.length, 5)} / ${papers.length} analyzed papers`,
        supportingPapers: g.supportingPapers || [],
        directEvidence: g.directEvidence || '',
        aiInterpretation: g.aiInterpretation || '',
        potentialResearchDirection: g.potentialResearchDirection || '',
        badges: g.badges || ['Evidence-backed', 'AI Interpretation', 'Suggested Direction'],
        impact_level: g.impact_level || 'High',
        supporting_evidence: g.supporting_evidence || [g.evidence],
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('research_gaps').insert([gapRecord]);
      } else {
        memoryStore.research_gaps.unshift(gapRecord);
      }
      createdGaps.push(gapRecord);
    }

    await updateProject(id, { status: 'gaps_detected' });

    return res.status(200).json({
      success: true,
      message: `Discovered ${createdGaps.length} evidence-backed research gaps.`,
      gaps: createdGaps
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 5. Stage endpoint: POST /api/research/:id/future
const formulateProjectFuture = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    let gaps = [];
    if (isConfigured && supabase) {
      const { data } = await supabase.from('research_gaps').select('*').eq('project_id', id);
      gaps = data || [];
    } else {
      gaps = memoryStore.research_gaps.filter(g => g.project_id === id);
    }

    const futureResult = await formulateFutureDirections(gaps, project.query);
    const createdDirections = [];

    for (const f of futureResult) {
      const dirRecord = {
        id: uuidv4(),
        project_id: id,
        title: f.title || f.proposal_title,
        problem: f.problem || '',
        whyExistingResearchIsInsufficient: f.whyExistingResearchIsInsufficient || '',
        possibleMethodology: f.possibleMethodology || f.suggested_methodology || '',
        expectedContribution: f.expectedContribution || f.potential_impact || '',
        proposal_title: f.title || f.proposal_title,
        hypothesis: f.expectedContribution || f.hypothesis || '',
        suggested_methodology: f.possibleMethodology || f.suggested_methodology || '',
        potential_impact: f.expectedContribution || f.potential_impact || '',
        feasibility_score: f.feasibilityScore || f.feasibility_score || 8,
        timeframe: f.timeframe || '12-18 months',
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('future_directions').insert([dirRecord]);
      } else {
        memoryStore.future_directions.unshift(dirRecord);
      }
      createdDirections.push(dirRecord);
    }

    await updateProject(id, { status: 'future_directions_formulated' });

    return res.status(200).json({
      success: true,
      message: `Formulated ${createdDirections.length} future research directions.`,
      directions: createdDirections
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 6. Stage endpoint: POST /api/research/:id/report
const generateProjectReport = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await findProject(id, req.user.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found.' });

    let papers = [];
    let comparisons = null;
    let gaps = [];
    let futureDirections = [];

    if (isConfigured && supabase) {
      const [pRes, cRes, gRes, fRes] = await Promise.all([
        supabase.from('papers').select('*').eq('project_id', id),
        supabase.from('paper_comparisons').select('*').eq('project_id', id).single(),
        supabase.from('research_gaps').select('*').eq('project_id', id),
        supabase.from('future_directions').select('*').eq('project_id', id)
      ]);
      papers = pRes.data || [];
      comparisons = cRes.data;
      gaps = gRes.data || [];
      futureDirections = fRes.data || [];
    } else {
      papers = memoryStore.papers.filter(p => p.project_id === id);
      comparisons = memoryStore.paper_comparisons.find(c => c.project_id === id);
      gaps = memoryStore.research_gaps.filter(g => g.project_id === id);
      futureDirections = memoryStore.future_directions.filter(f => f.project_id === id);
    }

    const reportData = await generateSynthesisReport(project, papers, comparisons, gaps, futureDirections);
    const reportRecord = {
      id: uuidv4(),
      project_id: id,
      title: reportData.title,
      executive_summary: reportData.executive_summary,
      markdown_content: reportData.markdown_content,
      table_of_contents: reportData.table_of_contents || [],
      format: 'markdown',
      version: 1,
      created_at: new Date().toISOString()
    };

    if (isConfigured && supabase) {
      await supabase.from('reports').insert([reportRecord]);
    } else {
      memoryStore.reports.unshift(reportRecord);
    }

    await updateProject(id, {
      status: 'completed',
      summary: reportData.executive_summary
    });

    return res.status(200).json({
      success: true,
      message: 'Comprehensive research report generated.',
      report: reportRecord
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * End-to-end background orchestration
 */
const executePipelineInternal = async (projectId, userId) => {
  logInfo(`Starting autonomous research execution for project: ${projectId}`);
  const project = await findProject(projectId, userId);
  if (!project) return;

  try {
    // 1. Search Papers
    const queries = project.plan?.searchQueries || project.plan?.searchTerms || [project.title, project.query];
    const targetCount = project.paperCount || 10;
    const rawPapers = await searchPapers(queries, project.domain, targetCount);
    const uniquePapers = deduplicatePapers(rawPapers);
    const rankedPapers = rankPapers(uniquePapers, project.query, project.plan?.targetMetrics || []);

    const createdPapers = [];
    for (const p of rankedPapers) {
      const paperRecord = {
        id: uuidv4(),
        project_id: projectId,
        title: p.title,
        authors: p.authors || [],
        abstract: p.abstract || '',
        year: p.year || new Date().getFullYear(),
        journal_or_venue: p.journal_or_venue || p.source || 'Preprint',
        doi: p.doi || '',
        url: p.url || '',
        citation_count: p.citationCount || p.citation_count || 0,
        source: p.source || 'arXiv',
        score: p.score || 8.5,
        created_at: new Date().toISOString()
      };

      if (isConfigured && supabase) {
        await supabase.from('papers').insert([paperRecord]);
      } else {
        memoryStore.papers.unshift(paperRecord);
      }
      createdPapers.push(paperRecord);
    }

    // 2. In-depth analysis of papers
    const analyzedPapers = [];
    for (const paper of createdPapers) {
      const analysis = await analyzePaper(paper, project.query);
      const analysisRecord = {
        id: uuidv4(),
        paper_id: paper.id,
        project_id: projectId,
        methodology: analysis.methodology,
        datasets_used: [analysis.dataset || 'Standard dataset'],
        sample_size: 'Standard test partitions',
        main_contributions: analysis.main_contributions || [analysis.keyFindings || 'Core contribution'],
        strengths: analysis.strengths || [analysis.results || 'Strong benchmark metrics'],
        limitations: analysis.limitations_list || [analysis.limitations || 'Controlled lab constraints'],
        relevance_score: analysis.relevance_score || 9,
        summary: analysis.summary || '',
        researchProblem: analysis.researchProblem,
        objective: analysis.objective,
        dataset: analysis.dataset,
        keyFindings: analysis.keyFindings,
        results: analysis.results,
        futureWork: analysis.futureWork,
        created_at: new Date().toISOString()
      };

      paper.analysis = analysisRecord;

      if (isConfigured && supabase) {
        await supabase.from('paper_analyses').insert([analysisRecord]);
      } else {
        memoryStore.paper_analyses.unshift(analysisRecord);
      }
      analyzedPapers.push(analysisRecord);
    }

    // 3. Cross-Paper Comparison Matrix
    const comparisonResult = await comparePapers(createdPapers, project.query);
    const comparisonRecord = {
      id: uuidv4(),
      project_id: projectId,
      matrix_data: comparisonResult.matrix_data || [],
      comparison_table: comparisonResult.comparison_table || [],
      insights: comparisonResult.insights || {},
      comparison_summary: comparisonResult.comparison_summary || '',
      key_tradeoffs: comparisonResult.key_tradeoffs || [],
      created_at: new Date().toISOString()
    };
    if (isConfigured && supabase) {
      await supabase.from('paper_comparisons').insert([comparisonRecord]);
    } else {
      memoryStore.paper_comparisons.unshift(comparisonRecord);
    }

    // 4. Detect Research Gaps
    const gapsResult = await detectResearchGaps(createdPapers, project.query);
    const createdGaps = [];
    for (const g of gapsResult) {
      const gapRecord = {
        id: uuidv4(),
        project_id: projectId,
        title: g.title,
        category: g.category || 'Generalizability',
        explanation: g.explanation || g.description,
        description: g.explanation || g.description,
        whyItMatters: g.whyItMatters || '',
        evidence: g.evidence || `${Math.min(createdPapers.length, 5)} / ${createdPapers.length} analyzed papers`,
        supportingPapers: g.supportingPapers || [],
        directEvidence: g.directEvidence || '',
        aiInterpretation: g.aiInterpretation || '',
        potentialResearchDirection: g.potentialResearchDirection || '',
        badges: g.badges || ['Evidence-backed', 'AI Interpretation', 'Suggested Direction'],
        impact_level: g.impact_level || 'High',
        supporting_evidence: g.supporting_evidence || [g.evidence],
        created_at: new Date().toISOString()
      };
      if (isConfigured && supabase) {
        await supabase.from('research_gaps').insert([gapRecord]);
      } else {
        memoryStore.research_gaps.unshift(gapRecord);
      }
      createdGaps.push(gapRecord);
    }

    // 5. Formulate Future Directions
    const futureResult = await formulateFutureDirections(createdGaps, project.query);
    const createdDirections = [];
    for (const f of futureResult) {
      const dirRecord = {
        id: uuidv4(),
        project_id: projectId,
        title: f.title || f.proposal_title,
        problem: f.problem || '',
        whyExistingResearchIsInsufficient: f.whyExistingResearchIsInsufficient || '',
        possibleMethodology: f.possibleMethodology || f.suggested_methodology || '',
        expectedContribution: f.expectedContribution || f.potential_impact || '',
        proposal_title: f.title || f.proposal_title,
        hypothesis: f.expectedContribution || f.hypothesis || '',
        suggested_methodology: f.possibleMethodology || f.suggested_methodology || '',
        potential_impact: f.expectedContribution || f.potential_impact || '',
        feasibility_score: f.feasibilityScore || f.feasibility_score || 8,
        timeframe: f.timeframe || '12-18 months',
        created_at: new Date().toISOString()
      };
      if (isConfigured && supabase) {
        await supabase.from('future_directions').insert([dirRecord]);
      } else {
        memoryStore.future_directions.unshift(dirRecord);
      }
      createdDirections.push(dirRecord);
    }

    // 6. Generate Synthesis Report
    const reportData = await generateSynthesisReport(project, createdPapers, comparisonRecord, createdGaps, createdDirections);
    const reportRecord = {
      id: uuidv4(),
      project_id: projectId,
      title: reportData.title,
      executive_summary: reportData.executive_summary,
      markdown_content: reportData.markdown_content,
      table_of_contents: reportData.table_of_contents,
      format: 'markdown',
      version: 1,
      created_at: new Date().toISOString()
    };
    if (isConfigured && supabase) {
      await supabase.from('reports').insert([reportRecord]);
    } else {
      memoryStore.reports.unshift(reportRecord);
    }

    await updateProject(projectId, {
      status: 'completed',
      summary: reportData.executive_summary
    });

    logInfo(`Pipeline finished successfully for project: ${projectId}`);
  } catch (error) {
    logError('Pipeline execution encountered an error:', error.message);
    await updateProject(projectId, { status: 'failed' });
  }
};

const executePipeline = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    executePipelineInternal(id, userId).catch(err => logError('Background pipeline error:', err));

    return res.status(200).json({
      success: true,
      message: 'Autonomous research pipeline started.'
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (isConfigured && supabase) {
      await supabase.from('research_projects').delete().eq('id', id);
    } else {
      memoryStore.research_projects = memoryStore.research_projects.filter(p => p.id !== id);
    }

    return res.status(200).json({ success: true, message: 'Project deleted successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  searchProjectPapers,
  analyzeProjectPapers,
  compareProjectPapers,
  detectProjectGaps,
  formulateProjectFuture,
  generateProjectReport,
  executePipeline,
  deleteProject
};
