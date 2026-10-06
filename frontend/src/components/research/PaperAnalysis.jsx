import React from 'react';
import { Microscope, Database, CheckCircle, AlertOctagon, Award, Target, TrendingUp, Lightbulb } from 'lucide-react';

export const PaperAnalysis = ({ analysis, paperTitle }) => {
  if (!analysis) return null;

  return (
    <div className="space-y-6">
      {paperTitle && (
        <div className="border-b border-slate-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <p className="text-xs uppercase font-semibold text-blue-400 tracking-wider">
              Structured Academic Paper Analysis
            </p>
            <h3 className="text-lg font-bold text-slate-100 mt-0.5">{paperTitle}</h3>
          </div>
          <div className="flex items-center gap-2 bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/30 self-start sm:self-center">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-300">
              Relevance: {analysis.relevance_score || 9}/10
            </span>
          </div>
        </div>
      )}

      {/* 1. Research Problem & Objective */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 uppercase tracking-wider">
            <Target className="w-4 h-4 text-rose-400" />
            Research Problem
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.researchProblem || 'Problem definition extracted from publication.'}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300 uppercase tracking-wider">
            <Microscope className="w-4 h-4 text-blue-400" />
            Research Objective
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.objective || 'Primary goal and hypotheses formulated by authors.'}
          </p>
        </div>
      </div>

      {/* 2. Methodology & Dataset */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300 uppercase tracking-wider">
            <Microscope className="w-4 h-4 text-indigo-400" />
            Methodology
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.methodology}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 uppercase tracking-wider">
            <Database className="w-4 h-4 text-emerald-400" />
            Dataset & Scale
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.dataset || (Array.isArray(analysis.datasets_used) ? analysis.datasets_used.join(', ') : 'Benchmark dataset')}
          </p>
        </div>
      </div>

      {/* 3. Key Findings & Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <CheckCircle className="w-4 h-4" />
            Key Findings
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.keyFindings || (Array.isArray(analysis.main_contributions) ? analysis.main_contributions.join('; ') : 'Key empirical insights')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider">
            <TrendingUp className="w-4 h-4" />
            Quantitative Results
          </div>
          <p className="text-xs text-slate-200 leading-relaxed">
            {analysis.results || (Array.isArray(analysis.strengths) ? analysis.strengths.join('; ') : 'Benchmark metrics')}
          </p>
        </div>
      </div>

      {/* 4. Limitations & Future Work */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <AlertOctagon className="w-4 h-4" />
            Limitations
          </div>
          <p className="text-xs text-rose-100 leading-relaxed">
            {analysis.limitations || (Array.isArray(analysis.limitations_list) ? analysis.limitations_list.join('; ') : 'Reported constraints')}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 space-y-1.5">
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4 text-purple-400" />
            Future Work
          </div>
          <p className="text-xs text-purple-100 leading-relaxed">
            {analysis.futureWork || 'Directions suggested by authors.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaperAnalysis;
